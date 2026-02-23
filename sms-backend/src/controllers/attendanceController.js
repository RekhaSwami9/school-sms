const { Attendance, Class } = require("../models");
const { Op } = require("sequelize");

// Get attendance for a class on a specific date
exports.getClassAttendance = async (req, res) => {
  try {
    const { classId, date } = req.query;

    if (!classId || !date) {
      return res.status(400).json({
        success: false,
        error: "Class ID and date are required",
      });
    }

    const attendance = await Attendance.findAll({
      where: {
        classId,
        date,
      },
      order: [["createdAt", "DESC"]],
    });

    res.json({
      success: true,
      attendance,
      date,
      classId,
    });
  } catch (error) {
    console.error("Error fetching attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch attendance",
    });
  }
};

// Get attendance for a specific student
exports.getStudentAttendance = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { startDate, endDate } = req.query;

    const where = { studentId };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const attendance = await Attendance.findAll({
      where,
      order: [["date", "DESC"]],
    });

    // Calculate statistics
    const total = attendance.length;
    const present = attendance.filter((a) => a.status === "present").length;
    const absent = attendance.filter((a) => a.status === "absent").length;
    const late = attendance.filter((a) => a.status === "late").length;
    const excused = attendance.filter((a) => a.status === "excused").length;

    res.json({
      success: true,
      attendance,
      statistics: {
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate: total > 0 ? ((present + late) / total) * 100 : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching student attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch student attendance",
    });
  }
};

// Mark or update attendance
exports.markAttendance = async (req, res) => {
  try {
    const { studentId, classId, date, status, remarks } = req.body;

    if (!studentId || !classId || !date || !status) {
      return res.status(400).json({
        success: false,
        error: "Student ID, class ID, date, and status are required",
      });
    }

    // Check if attendance already exists
    const existingAttendance = await Attendance.findOne({
      where: {
        studentId,
        date,
      },
    });

    let attendance;
    if (existingAttendance) {
      // Update existing
      await existingAttendance.update({
        status,
        remarks: remarks || existingAttendance.remarks,
        markedBy: req.user?.id || null,
      });
      attendance = existingAttendance;
    } else {
      // Create new
      attendance = await Attendance.create({
        studentId,
        classId,
        date,
        status,
        remarks: remarks || "",
        markedBy: req.user?.id || null,
      });
    }

    res.json({
      success: true,
      message: "Attendance marked successfully",
      attendance,
    });
  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark attendance",
    });
  }
};

// Bulk mark attendance for a class
exports.bulkMarkAttendance = async (req, res) => {
  try {
    const { classId, date, attendanceData } = req.body;

    if (
      !classId ||
      !date ||
      !attendanceData ||
      !Array.isArray(attendanceData)
    ) {
      return res.status(400).json({
        success: false,
        error: "Class ID, date, and attendance data are required",
      });
    }

    const results = [];
    const errors = [];

    for (const record of attendanceData) {
      try {
        const { studentId, status, remarks } = record;

        const existingAttendance = await Attendance.findOne({
          where: {
            studentId,
            date,
          },
        });

        if (existingAttendance) {
          await existingAttendance.update({
            status,
            remarks: remarks || existingAttendance.remarks,
            markedBy: req.user?.id || null,
          });
          results.push(existingAttendance);
        } else {
          const newAttendance = await Attendance.create({
            studentId,
            classId,
            date,
            status,
            remarks: remarks || "",
            markedBy: req.user?.id || null,
          });
          results.push(newAttendance);
        }
      } catch (err) {
        errors.push({ studentId: record.studentId, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Attendance marked for ${results.length} students`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error in bulk attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to mark attendance",
    });
  }
};

// Get attendance report for a class
exports.getClassAttendanceReport = async (req, res) => {
  try {
    const { classId } = req.params;
    const { startDate, endDate } = req.query;

    const where = { classId };

    if (startDate && endDate) {
      where.date = {
        [Op.between]: [startDate, endDate],
      };
    }

    const attendance = await Attendance.findAll({
      where,
      order: [["date", "DESC"]],
    });

    // Group by date
    const groupedByDate = attendance.reduce((acc, record) => {
      if (!acc[record.date]) {
        acc[record.date] = [];
      }
      acc[record.date].push(record);
      return acc;
    }, {});

    // Calculate daily statistics
    const dailyStats = Object.keys(groupedByDate).map((date) => {
      const records = groupedByDate[date];
      const total = records.length;
      const present = records.filter((r) => r.status === "present").length;
      const absent = records.filter((r) => r.status === "absent").length;
      const late = records.filter((r) => r.status === "late").length;
      const excused = records.filter((r) => r.status === "excused").length;

      return {
        date,
        total,
        present,
        absent,
        late,
        excused,
        attendanceRate: total > 0 ? ((present + late) / total) * 100 : 0,
      };
    });

    res.json({
      success: true,
      dailyStats,
      totalRecords: attendance.length,
    });
  } catch (error) {
    console.error("Error fetching attendance report:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch attendance report",
    });
  }
};

// Delete attendance record
exports.deleteAttendance = async (req, res) => {
  try {
    const { id } = req.params;

    const attendance = await Attendance.findByPk(id);

    if (!attendance) {
      return res.status(404).json({
        success: false,
        error: "Attendance record not found",
      });
    }

    await attendance.destroy();

    res.json({
      success: true,
      message: "Attendance record deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting attendance:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete attendance record",
    });
  }
};

const { Grade } = require("../models");
const { Op } = require("sequelize");

// Helper function to calculate grade from marks
const calculateGrade = (marks, maxMarks = 100) => {
  const percentage = (marks / maxMarks) * 100;

  if (percentage >= 90) return "A+";
  if (percentage >= 80) return "A";
  if (percentage >= 70) return "B+";
  if (percentage >= 60) return "B";
  if (percentage >= 50) return "C";
  if (percentage >= 40) return "D";
  return "F";
};

// Helper function to calculate GPA
const calculateGPA = (grades) => {
  const gradePoints = {
    "A+": 10,
    A: 9,
    "B+": 8,
    B: 7,
    C: 6,
    D: 5,
    F: 0,
  };

  if (grades.length === 0) return 0;

  const totalPoints = grades.reduce((sum, grade) => {
    return sum + (gradePoints[grade.grade] || 0);
  }, 0);

  return (totalPoints / grades.length).toFixed(2);
};

// Create or update grade
exports.createOrUpdateGrade = async (req, res) => {
  try {
    const {
      studentId,
      subjectId,
      classId,
      examType,
      marks,
      maxMarks = 100,
      remarks,
      date,
      academicYear,
    } = req.body;

    // Validation
    if (
      !studentId ||
      !subjectId ||
      !classId ||
      !examType ||
      marks === undefined ||
      !date ||
      !academicYear
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    if (marks < 0 || marks > maxMarks) {
      return res.status(400).json({
        success: false,
        error: `Marks must be between 0 and ${maxMarks}`,
      });
    }

    // Calculate grade
    const grade = calculateGrade(marks, maxMarks);

    // Check if grade already exists for this student/subject/exam
    const existingGrade = await Grade.findOne({
      where: {
        studentId,
        subjectId,
        examType,
        academicYear,
      },
    });

    let result;
    if (existingGrade) {
      // Update existing
      await existingGrade.update({
        marks,
        maxMarks,
        grade,
        remarks: remarks || existingGrade.remarks,
        date,
        recordedBy: req.user?.id || null,
      });
      result = existingGrade;
    } else {
      // Create new
      result = await Grade.create({
        studentId,
        subjectId,
        classId,
        examType,
        marks,
        maxMarks,
        grade,
        remarks: remarks || "",
        date,
        academicYear,
        recordedBy: req.user?.id || null,
      });
    }

    res.json({
      success: true,
      message: existingGrade
        ? "Grade updated successfully"
        : "Grade created successfully",
      grade: result,
    });
  } catch (error) {
    console.error("Error creating/updating grade:", error);
    res.status(500).json({
      success: false,
      error: "Failed to save grade",
    });
  }
};

// Get grades for a student
exports.getStudentGrades = async (req, res) => {
  try {
    const { studentId } = req.params;
    const { academicYear, subjectId, examType } = req.query;

    const where = { studentId };

    if (academicYear) where.academicYear = academicYear;
    if (subjectId) where.subjectId = subjectId;
    if (examType) where.examType = examType;

    const grades = await Grade.findAll({
      where,
      order: [["date", "DESC"]],
    });

    // Calculate statistics
    const totalSubjects = new Set(grades.map((g) => g.subjectId)).size;
    const averageMarks =
      grades.length > 0
        ? (
            grades.reduce((sum, g) => sum + parseFloat(g.marks), 0) /
            grades.length
          ).toFixed(2)
        : 0;
    const gpa = calculateGPA(grades);

    // Group by subject
    const subjectWise = {};
    grades.forEach((grade) => {
      if (!subjectWise[grade.subjectId]) {
        subjectWise[grade.subjectId] = [];
      }
      subjectWise[grade.subjectId].push(grade);
    });

    res.json({
      success: true,
      grades,
      statistics: {
        totalGrades: grades.length,
        totalSubjects,
        averageMarks,
        gpa,
      },
      subjectWise,
    });
  } catch (error) {
    console.error("Error fetching student grades:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch grades",
    });
  }
};

// Get grades for a class
exports.getClassGrades = async (req, res) => {
  try {
    const { classId } = req.params;
    const { academicYear, subjectId, examType } = req.query;

    const where = { classId };

    if (academicYear) where.academicYear = academicYear;
    if (subjectId) where.subjectId = subjectId;
    if (examType) where.examType = examType;

    const grades = await Grade.findAll({
      where,
      order: [["date", "DESC"]],
    });

    // Calculate class statistics
    const totalStudents = new Set(grades.map((g) => g.studentId)).size;
    const averageMarks =
      grades.length > 0
        ? (
            grades.reduce((sum, g) => sum + parseFloat(g.marks), 0) /
            grades.length
          ).toFixed(2)
        : 0;

    // Grade distribution
    const gradeDistribution = {
      "A+": grades.filter((g) => g.grade === "A+").length,
      A: grades.filter((g) => g.grade === "A").length,
      "B+": grades.filter((g) => g.grade === "B+").length,
      B: grades.filter((g) => g.grade === "B").length,
      C: grades.filter((g) => g.grade === "C").length,
      D: grades.filter((g) => g.grade === "D").length,
      F: grades.filter((g) => g.grade === "F").length,
    };

    res.json({
      success: true,
      grades,
      statistics: {
        totalGrades: grades.length,
        totalStudents,
        averageMarks,
        gradeDistribution,
      },
    });
  } catch (error) {
    console.error("Error fetching class grades:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch class grades",
    });
  }
};

// Get all grades with filters
exports.getAllGrades = async (req, res) => {
  try {
    const { academicYear, subjectId, classId, examType, studentId } = req.query;

    const where = {};

    if (academicYear) where.academicYear = academicYear;
    if (subjectId) where.subjectId = subjectId;
    if (classId) where.classId = classId;
    if (examType) where.examType = examType;
    if (studentId) where.studentId = studentId;

    const grades = await Grade.findAll({
      where,
      order: [["date", "DESC"]],
    });

    res.json({
      success: true,
      grades,
      count: grades.length,
    });
  } catch (error) {
    console.error("Error fetching grades:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch grades",
    });
  }
};

// Get grade by ID
exports.getGradeById = async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findByPk(id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: "Grade not found",
      });
    }

    res.json({
      success: true,
      grade,
    });
  } catch (error) {
    console.error("Error fetching grade:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch grade",
    });
  }
};

// Update grade
exports.updateGrade = async (req, res) => {
  try {
    const { id } = req.params;
    const { marks, maxMarks, remarks, date } = req.body;

    const grade = await Grade.findByPk(id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: "Grade not found",
      });
    }

    // Recalculate grade if marks changed
    const newGrade =
      marks !== undefined
        ? calculateGrade(marks, maxMarks || grade.maxMarks)
        : grade.grade;

    await grade.update({
      marks: marks !== undefined ? marks : grade.marks,
      maxMarks: maxMarks || grade.maxMarks,
      grade: newGrade,
      remarks: remarks !== undefined ? remarks : grade.remarks,
      date: date || grade.date,
      recordedBy: req.user?.id || null,
    });

    res.json({
      success: true,
      message: "Grade updated successfully",
      grade,
    });
  } catch (error) {
    console.error("Error updating grade:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update grade",
    });
  }
};

// Delete grade
exports.deleteGrade = async (req, res) => {
  try {
    const { id } = req.params;

    const grade = await Grade.findByPk(id);

    if (!grade) {
      return res.status(404).json({
        success: false,
        error: "Grade not found",
      });
    }

    await grade.destroy();

    res.json({
      success: true,
      message: "Grade deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting grade:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete grade",
    });
  }
};

// Bulk create grades
exports.bulkCreateGrades = async (req, res) => {
  try {
    const { grades } = req.body;

    if (!grades || !Array.isArray(grades) || grades.length === 0) {
      return res.status(400).json({
        success: false,
        error: "Grades array is required",
      });
    }

    const results = [];
    const errors = [];

    for (const gradeData of grades) {
      try {
        const {
          studentId,
          subjectId,
          classId,
          examType,
          marks,
          maxMarks = 100,
          remarks,
          date,
          academicYear,
        } = gradeData;

        const grade = calculateGrade(marks, maxMarks);

        const existingGrade = await Grade.findOne({
          where: {
            studentId,
            subjectId,
            examType,
            academicYear,
          },
        });

        if (existingGrade) {
          await existingGrade.update({
            marks,
            maxMarks,
            grade,
            remarks: remarks || existingGrade.remarks,
            date,
            recordedBy: req.user?.id || null,
          });
          results.push(existingGrade);
        } else {
          const newGrade = await Grade.create({
            studentId,
            subjectId,
            classId,
            examType,
            marks,
            maxMarks,
            grade,
            remarks: remarks || "",
            date,
            academicYear,
            recordedBy: req.user?.id || null,
          });
          results.push(newGrade);
        }
      } catch (err) {
        errors.push({ data: gradeData, error: err.message });
      }
    }

    res.json({
      success: true,
      message: `Processed ${results.length} grades`,
      results,
      errors: errors.length > 0 ? errors : undefined,
    });
  } catch (error) {
    console.error("Error in bulk grades:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process grades",
    });
  }
};

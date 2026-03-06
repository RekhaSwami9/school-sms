const db = require("../models");
const Fee = db.Fee;
const Student = db.Student;

// Get all fees
exports.getAllFees = async (req, res) => {
  try {
    const { status, academicYear, studentId, feeType } = req.query;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (academicYear) {
      whereClause.academicYear = academicYear;
    }

    if (studentId) {
      whereClause.studentId = studentId;
    }

    if (feeType) {
      whereClause.feeType = feeType;
    }

    const fees = await Fee.findAll({
      where: whereClause,
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "admissionNo", "classId"],
        },
      ],
      order: [["dueDate", "DESC"]],
    });

    // Calculate totals
    const totalAmount = fees.reduce(
      (sum, fee) => sum + parseFloat(fee.amount),
      0,
    );
    const totalPaid = fees.reduce(
      (sum, fee) => sum + parseFloat(fee.paidAmount),
      0,
    );
    const pendingCount = fees.filter(
      (f) => f.status === "Pending" || f.status === "Overdue",
    ).length;

    res.json({
      success: true,
      fees: fees,
      count: fees.length,
      summary: {
        totalAmount,
        totalPaid,
        pendingAmount: totalAmount - totalPaid,
        pendingCount,
      },
    });
  } catch (error) {
    console.error("Error fetching fees:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch fees",
    });
  }
};

// Get fee by ID
exports.getFeeById = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findByPk(id, {
      include: [
        {
          model: Student,
          as: "student",
          attributes: ["id", "name", "admissionNo", "classId"],
        },
      ],
    });

    if (!fee) {
      return res.status(404).json({
        success: false,
        error: "Fee not found",
      });
    }

    res.json({
      success: true,
      fee: fee,
    });
  } catch (error) {
    console.error("Error fetching fee:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch fee",
    });
  }
};

// Create new fee
exports.createFee = async (req, res) => {
  try {
    const { studentId, academicYear, feeType, amount, dueDate, remarks } =
      req.body;

    // Validation
    if (!studentId || !academicYear || !amount || !dueDate) {
      return res.status(400).json({
        success: false,
        error: "Student ID, academic year, amount, and due date are required",
      });
    }

    // Check if student exists
    const student = await Student.findByPk(studentId);
    if (!student) {
      return res.status(404).json({
        success: false,
        error: "Student not found",
      });
    }

    const fee = await Fee.create({
      studentId,
      academicYear,
      feeType: feeType || "Tuition",
      amount,
      paidAmount: 0,
      dueDate,
      status: "Pending",
      remarks: remarks || "",
    });

    res.status(201).json({
      success: true,
      message: "Fee created successfully",
      fee: fee,
    });
  } catch (error) {
    console.error("Error creating fee:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create fee",
    });
  }
};

// Update fee (payment)
exports.updateFee = async (req, res) => {
  try {
    const { id } = req.params;
    const { paidAmount, paidDate, paymentMethod, status, remarks } = req.body;

    const fee = await Fee.findByPk(id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        error: "Fee not found",
      });
    }

    // Update fields
    if (paidAmount !== undefined) {
      fee.paidAmount = paidAmount;
      // Auto-update status based on payment
      if (parseFloat(paidAmount) >= parseFloat(fee.amount)) {
        fee.status = "Paid";
      } else if (parseFloat(paidAmount) > 0) {
        fee.status = "Partial";
      }
    }

    if (paidDate) fee.paidDate = paidDate;
    if (paymentMethod) fee.paymentMethod = paymentMethod;
    if (status) fee.status = status;
    if (remarks !== undefined) fee.remarks = remarks;

    await fee.save();

    res.json({
      success: true,
      message: "Fee updated successfully",
      fee: fee,
    });
  } catch (error) {
    console.error("Error updating fee:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update fee",
    });
  }
};

// Delete fee
exports.deleteFee = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findByPk(id);

    if (!fee) {
      return res.status(404).json({
        success: false,
        error: "Fee not found",
      });
    }

    await fee.destroy();

    res.json({
      success: true,
      message: "Fee deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting fee:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete fee",
    });
  }
};

// Get fee statistics
exports.getFeeStats = async (req, res) => {
  try {
    const { academicYear } = req.query;
    const whereClause = {};

    if (academicYear) {
      whereClause.academicYear = academicYear;
    }

    const fees = await Fee.findAll({ where: whereClause });

    const totalAmount = fees.reduce(
      (sum, fee) => sum + parseFloat(fee.amount),
      0,
    );
    const totalPaid = fees.reduce(
      (sum, fee) => sum + parseFloat(fee.paidAmount),
      0,
    );
    const pendingFees = fees.filter(
      (f) => f.status === "Pending" || f.status === "Overdue",
    );
    const paidFees = fees.filter((f) => f.status === "Paid");
    const partialFees = fees.filter((f) => f.status === "Partial");

    res.json({
      success: true,
      stats: {
        totalAmount,
        totalPaid,
        pendingAmount: totalAmount - totalPaid,
        totalFees: fees.length,
        paidCount: paidFees.length,
        pendingCount: pendingFees.length,
        partialCount: partialFees.length,
        collectionRate:
          totalAmount > 0 ? ((totalPaid / totalAmount) * 100).toFixed(2) : 0,
      },
    });
  } catch (error) {
    console.error("Error fetching fee stats:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch fee statistics",
    });
  }
};

// Send payment reminder (simulated)
exports.sendReminder = async (req, res) => {
  try {
    const { id } = req.params;
    const fee = await Fee.findByPk(id, {
      include: [{ model: Student, as: "student" }],
    });

    if (!fee) {
      return res.status(404).json({
        success: false,
        error: "Fee not found",
      });
    }

    // In production, this would send an email/SMS
    // For now, we'll just return success
    res.json({
      success: true,
      message: `Payment reminder sent to parent of ${fee.student.name}`,
    });
  } catch (error) {
    console.error("Error sending reminder:", error);
    res.status(500).json({
      success: false,
      error: "Failed to send reminder",
    });
  }
};

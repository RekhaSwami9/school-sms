const db = require("../models");
const Subject = db.Subject;

// Get all subjects
exports.getAllSubjects = async (req, res) => {
  try {
    const { status, search } = req.query;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { code: { [db.Sequelize.Op.like]: `%${search}%` } },
        { description: { [db.Sequelize.Op.like]: `%${search}%` } },
      ];
    }

    const subjects = await Subject.findAll({
      where: whereClause,
      include: [
        {
          model: db.Teacher,
          as: "teacher",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      subjects: subjects,
      count: subjects.length,
    });
  } catch (error) {
    console.error("Error fetching subjects:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch subjects",
    });
  }
};

// Get subject by ID
exports.getSubjectById = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id, {
      include: [
        {
          model: db.Teacher,
          as: "teacher",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    res.json({
      success: true,
      subject: subject,
    });
  } catch (error) {
    console.error("Error fetching subject:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch subject",
    });
  }
};

// Create new subject
exports.createSubject = async (req, res) => {
  try {
    const { name, code, description, credits, teacherId, status } = req.body;

    // Validation
    if (!name || !code) {
      return res.status(400).json({
        success: false,
        error: "Name and code are required",
      });
    }

    // Check if code already exists
    const existingSubject = await Subject.findOne({ where: { code } });
    if (existingSubject) {
      return res.status(400).json({
        success: false,
        error: "Subject code already exists",
      });
    }

    const subject = await Subject.create({
      name,
      code,
      description: description || "",
      credits: credits || 3,
      teacherId: teacherId || null,
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Subject created successfully",
      subject: subject,
    });
  } catch (error) {
    console.error("Error creating subject:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create subject",
    });
  }
};

// Update subject
exports.updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, code, description, credits, teacherId, status } = req.body;

    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    // Check if code is being changed and if it already exists
    if (code && code !== subject.code) {
      const existingSubject = await Subject.findOne({ where: { code } });
      if (existingSubject) {
        return res.status(400).json({
          success: false,
          error: "Subject code already exists",
        });
      }
    }

    // Update fields
    subject.name = name || subject.name;
    subject.code = code || subject.code;
    subject.description =
      description !== undefined ? description : subject.description;
    subject.credits = credits !== undefined ? credits : subject.credits;
    subject.teacherId = teacherId !== undefined ? teacherId : subject.teacherId;
    subject.status = status || subject.status;

    await subject.save();

    res.json({
      success: true,
      message: "Subject updated successfully",
      subject: subject,
    });
  } catch (error) {
    console.error("Error updating subject:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update subject",
    });
  }
};

// Delete subject
exports.deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const subject = await Subject.findByPk(id);

    if (!subject) {
      return res.status(404).json({
        success: false,
        error: "Subject not found",
      });
    }

    await subject.destroy();

    res.json({
      success: true,
      message: "Subject deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting subject:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete subject",
    });
  }
};

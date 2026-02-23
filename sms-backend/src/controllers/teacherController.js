const db = require("../models");
const Teacher = db.Teacher;

// Get all teachers
exports.getAllTeachers = async (req, res) => {
  try {
    const { status, employmentType, search } = req.query;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (employmentType) {
      whereClause.employmentType = employmentType;
    }

    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } },
        { qualification: { [db.Sequelize.Op.like]: `%${search}%` } },
      ];
    }

    const teachers = await Teacher.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      teachers: teachers,
      count: teachers.length,
    });
  } catch (error) {
    console.error("Error fetching teachers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch teachers",
    });
  }
};

// Get teacher by ID
exports.getTeacherById = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    res.json({
      success: true,
      teacher: teacher,
    });
  } catch (error) {
    console.error("Error fetching teacher:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch teacher",
    });
  }
};

// Create new teacher
exports.createTeacher = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      qualification,
      experience,
      employmentType,
      joinDate,
      subjects,
      status,
    } = req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    // Check if email already exists
    const existingTeacher = await Teacher.findOne({ where: { email } });
    if (existingTeacher) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const teacher = await Teacher.create({
      name,
      email,
      phone: phone || "",
      qualification: qualification || "",
      experience: experience || 0,
      employmentType: employmentType || "Full-time",
      joinDate: joinDate || null,
      subjects: subjects || [],
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Teacher created successfully",
      teacher: teacher,
    });
  } catch (error) {
    console.error("Error creating teacher:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create teacher",
    });
  }
};

// Update teacher
exports.updateTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      qualification,
      experience,
      employmentType,
      joinDate,
      subjects,
      status,
    } = req.body;

    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== teacher.email) {
      const existingTeacher = await Teacher.findOne({ where: { email } });
      if (existingTeacher) {
        return res.status(400).json({
          success: false,
          error: "Email already registered",
        });
      }
    }

    // Update fields
    teacher.name = name || teacher.name;
    teacher.email = email || teacher.email;
    teacher.phone = phone !== undefined ? phone : teacher.phone;
    teacher.qualification =
      qualification !== undefined ? qualification : teacher.qualification;
    teacher.experience =
      experience !== undefined ? experience : teacher.experience;
    teacher.employmentType = employmentType || teacher.employmentType;
    teacher.joinDate = joinDate !== undefined ? joinDate : teacher.joinDate;
    teacher.subjects = subjects !== undefined ? subjects : teacher.subjects;
    teacher.status = status || teacher.status;

    await teacher.save();

    res.json({
      success: true,
      message: "Teacher updated successfully",
      teacher: teacher,
    });
  } catch (error) {
    console.error("Error updating teacher:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update teacher",
    });
  }
};

// Delete teacher
exports.deleteTeacher = async (req, res) => {
  try {
    const { id } = req.params;
    const teacher = await Teacher.findByPk(id);

    if (!teacher) {
      return res.status(404).json({
        success: false,
        error: "Teacher not found",
      });
    }

    await teacher.destroy();

    res.json({
      success: true,
      message: "Teacher deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting teacher:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete teacher",
    });
  }
};

const { Class, Teacher } = require("../models");

// Get all classes with optional filtering
exports.getAllClasses = async (req, res) => {
  try {
    const { status, grade, academicYear, search } = req.query;
    const where = {};

    if (status) where.status = status;
    if (grade) where.grade = grade;
    if (academicYear) where.academicYear = academicYear;

    if (search) {
      where[Op.or] = [
        { grade: { [Op.like]: `%${search}%` } },
        { section: { [Op.like]: `%${search}%` } },
        { room: { [Op.like]: `%${search}%` } },
      ];
    }

    const classes = await Class.findAll({
      where,
      include: [
        {
          model: Teacher,
          as: "classTeacher",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [
        ["grade", "ASC"],
        ["section", "ASC"],
      ],
    });

    res.json({
      success: true,
      classes,
      count: classes.length,
    });
  } catch (error) {
    console.error("Error fetching classes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch classes",
    });
  }
};

// Get single class by ID
exports.getClassById = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          as: "classTeacher",
          attributes: ["id", "name", "email", "phone"],
        },
      ],
    });

    if (!classItem) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    res.json({
      success: true,
      class: classItem,
    });
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch class",
    });
  }
};

// Create new class
exports.createClass = async (req, res) => {
  try {
    const {
      grade,
      section,
      classTeacherId,
      room,
      capacity,
      students,
      academicYear,
      status,
    } = req.body;

    // Check for duplicate class
    const existingClass = await Class.findOne({
      where: {
        grade,
        section,
        academicYear: academicYear || "2024-2025",
      },
    });

    if (existingClass) {
      return res.status(400).json({
        success: false,
        error:
          "Class already exists for this grade, section, and academic year",
      });
    }

    // Validate class teacher exists if provided
    if (classTeacherId) {
      const teacher = await Teacher.findByPk(classTeacherId);
      if (!teacher) {
        return res.status(400).json({
          success: false,
          error: "Selected class teacher not found",
        });
      }
    }

    const newClass = await Class.create({
      grade,
      section,
      classTeacherId,
      room,
      capacity: capacity || 30,
      students: students || 0,
      academicYear: academicYear || "2024-2025",
      status: status || "Active",
    });

    // Fetch the created class with teacher info
    const classWithTeacher = await Class.findByPk(newClass.id, {
      include: [
        {
          model: Teacher,
          as: "classTeacher",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Class created successfully",
      class: classWithTeacher,
    });
  } catch (error) {
    console.error("Error creating class:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to create class",
    });
  }
};

// Update class
exports.updateClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    const {
      grade,
      section,
      classTeacherId,
      room,
      capacity,
      students,
      academicYear,
      status,
    } = req.body;

    // Check for duplicate if grade/section/year changed
    if (
      (grade && grade !== classItem.grade) ||
      (section && section !== classItem.section) ||
      (academicYear && academicYear !== classItem.academicYear)
    ) {
      const existingClass = await Class.findOne({
        where: {
          grade: grade || classItem.grade,
          section: section || classItem.section,
          academicYear: academicYear || classItem.academicYear,
          id: { [require("sequelize").Op.ne]: req.params.id },
        },
      });

      if (existingClass) {
        return res.status(400).json({
          success: false,
          error:
            "Class already exists for this grade, section, and academic year",
        });
      }
    }

    // Validate class teacher exists if provided
    if (classTeacherId) {
      const teacher = await Teacher.findByPk(classTeacherId);
      if (!teacher) {
        return res.status(400).json({
          success: false,
          error: "Selected class teacher not found",
        });
      }
    }

    await classItem.update({
      grade: grade || classItem.grade,
      section: section || classItem.section,
      classTeacherId:
        classTeacherId !== undefined
          ? classTeacherId
          : classItem.classTeacherId,
      room: room !== undefined ? room : classItem.room,
      capacity: capacity || classItem.capacity,
      students: students !== undefined ? students : classItem.students,
      academicYear: academicYear || classItem.academicYear,
      status: status || classItem.status,
    });

    // Fetch updated class with teacher info
    const updatedClass = await Class.findByPk(req.params.id, {
      include: [
        {
          model: Teacher,
          as: "classTeacher",
          attributes: ["id", "name", "email"],
        },
      ],
    });

    res.json({
      success: true,
      message: "Class updated successfully",
      class: updatedClass,
    });
  } catch (error) {
    console.error("Error updating class:", error);
    res.status(500).json({
      success: false,
      error: error.message || "Failed to update class",
    });
  }
};

// Delete class
exports.deleteClass = async (req, res) => {
  try {
    const classItem = await Class.findByPk(req.params.id);

    if (!classItem) {
      return res.status(404).json({
        success: false,
        error: "Class not found",
      });
    }

    await classItem.destroy();

    res.json({
      success: true,
      message: "Class deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting class:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete class",
    });
  }
};

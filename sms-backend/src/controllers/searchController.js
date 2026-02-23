const { Student, User, Teacher, Class, Event } = require("../models");
const { Op } = require("sequelize");

// Global search across all entities
exports.globalSearch = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: "Search query must be at least 2 characters",
      });
    }

    const searchTerm = query.trim().toLowerCase();
    const likeQuery = `%${searchTerm}%`;

    // Search students
    const students = await Student.findAll({
      include: [
        {
          model: User,
          as: "user",
          where: {
            [Op.or]: [
              { name: { [Op.like]: likeQuery } },
              { email: { [Op.like]: likeQuery } },
            ],
          },
          required: true,
        },
      ],
      limit: 10,
    });

    // Search teachers
    const teachers = await Teacher.findAll({
      where: {
        [Op.or]: [
          { name: { [Op.like]: likeQuery } },
          { email: { [Op.like]: likeQuery } },
          { qualification: { [Op.like]: likeQuery } },
        ],
      },
      limit: 10,
    });

    // Search classes
    const classes = await Class.findAll({
      where: {
        [Op.or]: [
          { grade: { [Op.like]: likeQuery } },
          { section: { [Op.like]: likeQuery } },
          { room: { [Op.like]: likeQuery } },
        ],
      },
      limit: 10,
    });

    // Search events
    const events = await Event.findAll({
      where: {
        [Op.or]: [
          { title: { [Op.like]: likeQuery } },
          { description: { [Op.like]: likeQuery } },
          { location: { [Op.like]: likeQuery } },
        ],
      },
      limit: 10,
    });

    res.json({
      success: true,
      query: searchTerm,
      results: {
        students: {
          count: students.length,
          data: students,
        },
        teachers: {
          count: teachers.length,
          data: teachers,
        },
        classes: {
          count: classes.length,
          data: classes,
        },
        events: {
          count: events.length,
          data: events,
        },
      },
      totalCount:
        students.length + teachers.length + classes.length + events.length,
    });
  } catch (error) {
    console.error("Error in global search:", error);
    res.status(500).json({
      success: false,
      error: "Failed to perform search",
    });
  }
};

// Advanced search for students
exports.searchStudents = async (req, res) => {
  try {
    const {
      query,
      class_name,
      section,
      gender,
      status,
      admission_no,
      sortBy = "name",
      sortOrder = "ASC",
    } = req.query;

    const where = {};
    const userWhere = {};

    // Text search across multiple fields
    if (query) {
      const likeQuery = `%${query}%`;
      userWhere[Op.or] = [
        { name: { [Op.like]: likeQuery } },
        { email: { [Op.like]: likeQuery } },
      ];
      where[Op.or] = [{ admission_no: { [Op.like]: likeQuery } }];
    }

    // Specific filters
    if (admission_no) where.admission_no = { [Op.like]: `%${admission_no}%` };
    if (class_name) where.class_name = class_name;
    if (section) where.section = section;
    if (gender) where.gender = gender;

    const students = await Student.findAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          where: Object.keys(userWhere).length > 0 ? userWhere : undefined,
          attributes: ["id", "name", "email"],
          required: Object.keys(userWhere).length > 0,
        },
      ],
      order: [[{ model: User, as: "user" }, sortBy, sortOrder]],
    });

    res.json({
      success: true,
      count: students.length,
      students,
    });
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search students",
    });
  }
};

// Advanced search for teachers
exports.searchTeachers = async (req, res) => {
  try {
    const {
      query,
      employmentType,
      status,
      minExperience,
      maxExperience,
      sortBy = "name",
      sortOrder = "ASC",
    } = req.query;

    const where = {};

    // Text search
    if (query) {
      const likeQuery = `%${query}%`;
      where[Op.or] = [
        { name: { [Op.like]: likeQuery } },
        { email: { [Op.like]: likeQuery } },
        { qualification: { [Op.like]: likeQuery } },
        { phone: { [Op.like]: likeQuery } },
      ];
    }

    // Specific filters
    if (employmentType) where.employmentType = employmentType;
    if (status) where.status = status;
    if (minExperience) where.experience = { [Op.gte]: parseInt(minExperience) };
    if (maxExperience) {
      where.experience = {
        ...where.experience,
        [Op.lte]: parseInt(maxExperience),
      };
    }

    const teachers = await Teacher.findAll({
      where,
      order: [[sortBy, sortOrder]],
    });

    res.json({
      success: true,
      count: teachers.length,
      teachers,
    });
  } catch (error) {
    console.error("Error searching teachers:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search teachers",
    });
  }
};

// Advanced search for classes
exports.searchClasses = async (req, res) => {
  try {
    const {
      query,
      grade,
      section,
      status,
      minCapacity,
      maxCapacity,
      sortBy = "grade",
      sortOrder = "ASC",
    } = req.query;

    const where = {};

    // Text search
    if (query) {
      const likeQuery = `%${query}%`;
      where[Op.or] = [
        { grade: { [Op.like]: likeQuery } },
        { section: { [Op.like]: likeQuery } },
        { room: { [Op.like]: likeQuery } },
      ];
    }

    // Specific filters
    if (grade) where.grade = grade;
    if (section) where.section = section;
    if (status) where.status = status;
    if (minCapacity) where.capacity = { [Op.gte]: parseInt(minCapacity) };
    if (maxCapacity) {
      where.capacity = {
        ...where.capacity,
        [Op.lte]: parseInt(maxCapacity),
      };
    }

    const classes = await Class.findAll({
      where,
      order: [[sortBy, sortOrder]],
    });

    res.json({
      success: true,
      count: classes.length,
      classes,
    });
  } catch (error) {
    console.error("Error searching classes:", error);
    res.status(500).json({
      success: false,
      error: "Failed to search classes",
    });
  }
};

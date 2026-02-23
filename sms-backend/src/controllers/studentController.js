const { Student, User } = require("../models");
const bcrypt = require("bcrypt");

exports.createStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      admission_no,
      dob,
      gender,
      class_name,
      section,
    } = req.body;
    if (!name || !email) return res.status(400).json({ msg: "Missing fields" });
    const existing = await User.findOne({ where: { email } });
    if (existing) return res.status(400).json({ msg: "Email exists" });
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password || "student123", salt);
    const user = await User.create({
      name,
      email,
      password: hash,
      role: "student",
    });
    const student = await Student.create({
      admission_no,
      userId: user.id,
      dob,
      gender,
      class_name,
      section,
    });
    res.status(201).json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getAll = async (req, res) => {
  try {
    const { classId, class_name, search } = req.query;
    const where = {};

    // Filter by class name (grade)
    if (class_name) {
      where.class_name = class_name;
    }

    // Search by admission number or other fields
    if (search) {
      where.admission_no = { [require("sequelize").Op.like]: `%${search}%` };
    }

    const students = await Student.findAll({
      where,
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    res.json({ students });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getById = async (req, res) => {
  try {
    const { id } = req.params;
    const student = await Student.findByPk(id, {
      include: [
        { model: User, as: "user", attributes: ["id", "name", "email"] },
      ],
    });
    if (!student) return res.status(404).json({ msg: "Student not found" });
    res.json({ student });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.updateStudent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, admission_no, dob, gender, class_name, section } =
      req.body;

    const student = await Student.findByPk(id, {
      include: [{ model: User, as: "user" }],
    });
    if (!student) return res.status(404).json({ msg: "Student not found" });

    // Update user info
    if (name || email) {
      await student.user.update({
        name: name || student.user.name,
        email: email || student.user.email,
      });
    }

    // Update student info
    await student.update({ admission_no, dob, gender, class_name, section });

    res.json({
      student: await Student.findByPk(id, {
        include: [
          { model: User, as: "user", attributes: ["id", "name", "email"] },
        ],
      }),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

exports.deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByPk(req.params.id);
    if (!student) return res.status(404).json({ msg: "Student not found" });

    const userId = student.userId;
    await student.destroy();
    await User.destroy({ where: { id: userId } });

    res.json({ msg: "Student deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

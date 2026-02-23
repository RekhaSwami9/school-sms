const express = require("express");
const router = express.Router();
const teacherController = require("../controllers/teacherController");
const auth = require("../middlewares/auth");

// All routes require authentication
router.use(auth());

// GET /api/teachers - Get all teachers
router.get("/", teacherController.getAllTeachers);

// GET /api/teachers/:id - Get single teacher
router.get("/:id", teacherController.getTeacherById);

// POST /api/teachers - Create new teacher
router.post("/", teacherController.createTeacher);

// PUT /api/teachers/:id - Update teacher
router.put("/:id", teacherController.updateTeacher);

// DELETE /api/teachers/:id - Delete teacher
router.delete("/:id", teacherController.deleteTeacher);

module.exports = router;

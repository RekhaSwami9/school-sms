const express = require("express");
const router = express.Router();
const gradeController = require("../controllers/gradeController");
const auth = require("../middlewares/auth");

// All routes require authentication
router.use(auth());

// POST /api/grades - Create or update a grade
router.post("/", gradeController.createOrUpdateGrade);

// POST /api/grades/bulk - Bulk create/update grades
router.post("/bulk", gradeController.bulkCreateGrades);

// GET /api/grades - Get all grades with filters
router.get("/", gradeController.getAllGrades);

// GET /api/grades/student/:studentId - Get grades for a student
router.get("/student/:studentId", gradeController.getStudentGrades);

// GET /api/grades/class/:classId - Get grades for a class
router.get("/class/:classId", gradeController.getClassGrades);

// GET /api/grades/:id - Get grade by ID
router.get("/:id", gradeController.getGradeById);

// PUT /api/grades/:id - Update grade
router.put("/:id", gradeController.updateGrade);

// DELETE /api/grades/:id - Delete grade
router.delete("/:id", gradeController.deleteGrade);

module.exports = router;

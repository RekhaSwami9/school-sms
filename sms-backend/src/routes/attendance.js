const express = require("express");
const router = express.Router();
const attendanceController = require("../controllers/attendanceController");
const auth = require("../middlewares/auth");

// All routes require authentication
router.use(auth());

// GET /api/attendance/class - Get attendance for a class on a date
router.get("/class", attendanceController.getClassAttendance);

// GET /api/attendance/student/:studentId - Get attendance for a student
router.get("/student/:studentId", attendanceController.getStudentAttendance);

// POST /api/attendance/mark - Mark single attendance
router.post("/mark", attendanceController.markAttendance);

// POST /api/attendance/bulk - Bulk mark attendance
router.post("/bulk", attendanceController.bulkMarkAttendance);

// GET /api/attendance/report/:classId - Get attendance report for a class
router.get("/report/:classId", attendanceController.getClassAttendanceReport);

// DELETE /api/attendance/:id - Delete attendance record
router.delete("/:id", attendanceController.deleteAttendance);

module.exports = router;

const express = require("express");
const router = express.Router();
const searchController = require("../controllers/searchController");
const auth = require("../middlewares/auth");

// All routes require authentication
router.use(auth());

// GET /api/search - Global search across all entities
router.get("/", searchController.globalSearch);

// GET /api/search/students - Advanced student search
router.get("/students", searchController.searchStudents);

// GET /api/search/teachers - Advanced teacher search
router.get("/teachers", searchController.searchTeachers);

// GET /api/search/classes - Advanced class search
router.get("/classes", searchController.searchClasses);

module.exports = router;

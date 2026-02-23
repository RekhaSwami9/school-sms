const express = require("express");
const router = express.Router();
const classController = require("../controllers/classController");
const auth = require("../middlewares/auth");

// All routes require authentication
router.use(auth());

// GET /api/classes - Get all classes
router.get("/", classController.getAllClasses);

// GET /api/classes/:id - Get single class
router.get("/:id", classController.getClassById);

// POST /api/classes - Create new class
router.post("/", classController.createClass);

// PUT /api/classes/:id - Update class
router.put("/:id", classController.updateClass);

// DELETE /api/classes/:id - Delete class
router.delete("/:id", classController.deleteClass);

module.exports = router;

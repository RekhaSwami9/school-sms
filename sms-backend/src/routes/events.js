const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const auth = require("../middlewares/auth");

// All routes require authentication
router.use(auth());

// GET /api/events - Get all events
router.get("/", eventController.getAllEvents);

// GET /api/events/:id - Get single event
router.get("/:id", eventController.getEventById);

// POST /api/events - Create new event
router.post("/", eventController.createEvent);

// PUT /api/events/:id - Update event
router.put("/:id", eventController.updateEvent);

// DELETE /api/events/:id - Delete event
router.delete("/:id", eventController.deleteEvent);

module.exports = router;

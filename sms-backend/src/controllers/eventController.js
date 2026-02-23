const db = require("../models");
const Event = db.Event;

// Get all events
exports.getAllEvents = async (req, res) => {
  try {
    const { type, startDate, endDate } = req.query;
    const whereClause = {};

    if (type) {
      whereClause.type = type;
    }

    if (startDate && endDate) {
      whereClause.date = {
        [db.Sequelize.Op.between]: [startDate, endDate],
      };
    } else if (startDate) {
      whereClause.date = {
        [db.Sequelize.Op.gte]: startDate,
      };
    } else if (endDate) {
      whereClause.date = {
        [db.Sequelize.Op.lte]: endDate,
      };
    }

    const events = await Event.findAll({
      where: whereClause,
      order: [["date", "ASC"]],
    });

    res.json({
      success: true,
      events: events,
      count: events.length,
    });
  } catch (error) {
    console.error("Error fetching events:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch events",
    });
  }
};

// Get event by ID
exports.getEventById = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    res.json({
      success: true,
      event: event,
    });
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch event",
    });
  }
};

// Create new event
exports.createEvent = async (req, res) => {
  try {
    const { title, date, type, description, location, time } = req.body;

    // Validation
    if (!title || !date || !type) {
      return res.status(400).json({
        success: false,
        error: "Title, date, and type are required",
      });
    }

    const event = await Event.create({
      title,
      date,
      type,
      description: description || "",
      location: location || "",
      time: time || "",
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event: event,
    });
  } catch (error) {
    console.error("Error creating event:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create event",
    });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, date, type, description, location, time } = req.body;

    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    // Update fields
    event.title = title || event.title;
    event.date = date || event.date;
    event.type = type || event.type;
    event.description =
      description !== undefined ? description : event.description;
    event.location = location !== undefined ? location : event.location;
    event.time = time !== undefined ? time : event.time;

    await event.save();

    res.json({
      success: true,
      message: "Event updated successfully",
      event: event,
    });
  } catch (error) {
    console.error("Error updating event:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update event",
    });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    const { id } = req.params;
    const event = await Event.findByPk(id);

    if (!event) {
      return res.status(404).json({
        success: false,
        error: "Event not found",
      });
    }

    await event.destroy();

    res.json({
      success: true,
      message: "Event deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting event:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete event",
    });
  }
};

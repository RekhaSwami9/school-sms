const db = require("../models");
const Parent = db.Parent;

// Get all parents
exports.getAllParents = async (req, res) => {
  try {
    const { status, search, relation } = req.query;
    const whereClause = {};

    if (status) {
      whereClause.status = status;
    }

    if (relation) {
      whereClause.relation = relation;
    }

    if (search) {
      whereClause[db.Sequelize.Op.or] = [
        { name: { [db.Sequelize.Op.like]: `%${search}%` } },
        { email: { [db.Sequelize.Op.like]: `%${search}%` } },
        { phone: { [db.Sequelize.Op.like]: `%${search}%` } },
        { occupation: { [db.Sequelize.Op.like]: `%${search}%` } },
      ];
    }

    const parents = await Parent.findAll({
      where: whereClause,
      order: [["name", "ASC"]],
    });

    res.json({
      success: true,
      parents: parents,
      count: parents.length,
    });
  } catch (error) {
    console.error("Error fetching parents:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch parents",
    });
  }
};

// Get parent by ID
exports.getParentById = async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findByPk(id);

    if (!parent) {
      return res.status(404).json({
        success: false,
        error: "Parent not found",
      });
    }

    res.json({
      success: true,
      parent: parent,
    });
  } catch (error) {
    console.error("Error fetching parent:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch parent",
    });
  }
};

// Create new parent
exports.createParent = async (req, res) => {
  try {
    const { name, email, phone, occupation, address, relation, status } =
      req.body;

    // Validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: "Name and email are required",
      });
    }

    // Check if email already exists
    const existingParent = await Parent.findOne({ where: { email } });
    if (existingParent) {
      return res.status(400).json({
        success: false,
        error: "Email already registered",
      });
    }

    const parent = await Parent.create({
      name,
      email,
      phone: phone || "",
      occupation: occupation || "",
      address: address || "",
      relation: relation || "Father",
      status: status || "Active",
    });

    res.status(201).json({
      success: true,
      message: "Parent created successfully",
      parent: parent,
    });
  } catch (error) {
    console.error("Error creating parent:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create parent",
    });
  }
};

// Update parent
exports.updateParent = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, occupation, address, relation, status } =
      req.body;

    const parent = await Parent.findByPk(id);

    if (!parent) {
      return res.status(404).json({
        success: false,
        error: "Parent not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== parent.email) {
      const existingParent = await Parent.findOne({ where: { email } });
      if (existingParent) {
        return res.status(400).json({
          success: false,
          error: "Email already registered",
        });
      }
    }

    // Update fields
    parent.name = name || parent.name;
    parent.email = email || parent.email;
    parent.phone = phone !== undefined ? phone : parent.phone;
    parent.occupation =
      occupation !== undefined ? occupation : parent.occupation;
    parent.address = address !== undefined ? address : parent.address;
    parent.relation = relation || parent.relation;
    parent.status = status || parent.status;

    await parent.save();

    res.json({
      success: true,
      message: "Parent updated successfully",
      parent: parent,
    });
  } catch (error) {
    console.error("Error updating parent:", error);
    res.status(500).json({
      success: false,
      error: "Failed to update parent",
    });
  }
};

// Delete parent
exports.deleteParent = async (req, res) => {
  try {
    const { id } = req.params;
    const parent = await Parent.findByPk(id);

    if (!parent) {
      return res.status(404).json({
        success: false,
        error: "Parent not found",
      });
    }

    await parent.destroy();

    res.json({
      success: true,
      message: "Parent deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting parent:", error);
    res.status(500).json({
      success: false,
      error: "Failed to delete parent",
    });
  }
};

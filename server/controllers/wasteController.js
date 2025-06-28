//WASTE LISTING CRUD

const Waste = require("../models/Waste");

//Create waste listing
exports.createWaste = async (req, res) => {
  try {
    const waste = await Waste.create({
      title: req.body.title,
      description: req.body.description,
      quantity: req.body.quantity,
      location: req.body.location,
      createdBy: req.user.id, // req.user populated by protect middleware
    });
    res.status(201).json(waste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating waste" });
  }
};

// Get all waste listings
exports.getAllWaste = async (req, res) => {
  try {
    const waste = await Waste.find().populate("createdBy", "name email role");
    res.json(waste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching waste" });
  }
};

// Get single waste listing
exports.getWasteById = async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    if (!waste) {
      return res.status(404).json({ message: "Waste not found" });
    }
    res.json(waste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching waste" });
  }
};

// Delete waste listing
exports.deleteWaste = async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);
    if (!waste) {
      return res.status(404).json({ message: "Waste not found" });
    }
    // Only creator can delete
    if (waste.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this waste" });
    }
    await waste.deleteOne();
    res.json({ message: "Waste deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error deleting waste" });
  }
};

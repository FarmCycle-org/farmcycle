//WASTE LISTING CRUD

const Waste = require("../models/Waste");

//Create waste listing
exports.createWaste = async (req, res) => {
  try {
    const waste = await Waste.create({
      title: req.body.title,
      description: req.body.description,
      quantity: req.body.quantity,
      wasteType: req.body.wasteType,
      location: req.body.location,
      createdBy: req.user.id,
      organization: req.user.organization // req.user populated by protect middleware
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
    const waste = await Waste.find().populate("createdBy", "name email role organization");
    res.json(waste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching waste" });
  }
};

exports.getMyWaste = async (req, res) => {
  try {
    const listings = await Waste.find({ createdBy: req.user.id });
    res.json(listings);
  } catch (err) {
    console.error("Error fetching provider's listings:", err);
    res.status(500).json({ message: "Server error" });
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

// Mark waste as collected
exports.markAsCollected = async (req, res) => {
  try {
    const waste = await Waste.findById(req.params.id);

    if (!waste) {
      return res.status(404).json({ message: "Waste listing not found" });
    }

    // Ensure only the provider can mark as collected
    if (waste.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to mark this as collected" });
    }

    waste.status = "collected";
    await waste.save();

    res.json({ message: "Waste marked as collected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error marking waste as collected" });
  }
};

// Get all wastes created by the logged-in provider ,latest first
exports.getMyListings = async (req, res) => {
  try {
    const listings = await Waste.find({ createdBy: req.user.id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching your listings" });
  }
};



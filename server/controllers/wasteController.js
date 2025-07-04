//WASTE LISTING CRUD

const Waste = require("../models/Waste");
const Claim = require("../models/Claim");

// //Create waste listing
exports.createWaste = async (req, res) => {
  try {
    // Validate latitude and longitude
    if (!req.body.latitude || !req.body.longitude) {
      return res.status(400).json({ message: "Latitude and longitude are required." });
    }
    const waste = await Waste.create({
      title: req.body.title,
      description: req.body.description,
      quantity: req.body.quantity,
      wasteType: req.body.wasteType,

      organization: req.user.organization, // req.user populated by protect middleware

      location: {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude)
        ],
      },
      imageUrl: req.file?.path,
      createdBy: req.user.id, // req.user populated by protect middleware

    });
    res.status(201).json(waste);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating waste" });
  }
};

//Update waste listing
exports.updateWaste = async (req, res) => {
  try {
    const wasteId = req.params.id;

    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ message: "Waste listing not found" });
    }

    if (waste.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this listing" });
    }

    // If wasteType is missing in DB and not provided in request, error out
    if (!waste.wasteType && !req.body.wasteType) {
      return res.status(400).json({ message: "wasteType is required since it's missing." });
    }

    if (req.body.title !== undefined) waste.title = req.body.title;
    if (req.body.description !== undefined) waste.description = req.body.description;
    if (req.body.quantity !== undefined) waste.quantity = req.body.quantity;
    if (req.body.wasteType !== undefined) waste.wasteType = req.body.wasteType;
    
    // Update location if latitude and longitude are provided
    if (req.body.latitude && req.body.longitude) {
      waste.location = {
        type: "Point",
        coordinates: [
          parseFloat(req.body.longitude),
          parseFloat(req.body.latitude)
        ]
      };
    }
    // If new image uploaded, replace the URL
  
    if (req.file && req.file.path) {
      waste.imageUrl = req.file.path;
    } else if (!waste.imageUrl) {
      return res.status(400).json({ message: "Image is required for new listings." });
    }


    await waste.save();

    res.json({
      message: "Listing updated successfully",
      waste,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message, stack: err.stack });
  }
};

// Get all waste listings not claimed (accepted) yet
exports.getAllWaste = async (req, res) => {
  try {
    // Get waste IDs that already have an accepted claim
    const claimedWasteIds = await Claim.find({ status: "accepted" }).distinct("waste");

    // Fetch waste that is available and not already accepted by any collector
    const waste = await Waste.find({
      status: "available",
      _id: { $nin: claimedWasteIds },
    }).populate("createdBy", "name email role organization");

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



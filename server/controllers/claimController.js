const Claim = require("../models/Claim");
const Waste = require("../models/Waste");

// Create a claim
exports.createClaim = async (req, res) => {
  try {
    const { message } = req.body;
    const wasteId = req.params.id;

    const waste = await Waste.findById(wasteId);
    if (!waste) {
      return res.status(404).json({ message: "Waste listing not found" });
    }

    const claim = await Claim.create({
      waste: wasteId,
      collector: req.user.id,
      message,
    });

    res.status(201).json(claim);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error creating claim" });
  }
};

// Get claims for a specific waste listing (provider)
exports.getClaimsForWaste = async (req, res) => {
  try {
    const claims = await Claim.find({ waste: req.params.id })
      .populate("collector", "name email")
      .populate("waste", "title");

    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching claims" });
  }
};

// Get claims made by logged-in collector
exports.getMyClaims = async (req, res) => {
  try {
    console.log("Authenticated user:", req.user);
    const claims = await Claim.find({ collector: req.user.id })
      .populate("waste", "title description");

    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching my claims" });
  }
};
 
//Approve/Reject claims
// Approve a claim
exports.approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("waste");
    console.log("Fetched claim:", claim);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Ensure only the provider who owns the waste can approve
    if (claim.waste.createdBy.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to approve this claim" });
    }

    // Update claim status
    claim.status = "accepted";
    await claim.save();

    // Update waste status
    // claim.waste.status = "claimed";
    // await claim.waste.save();

    res.json({ message: "Claim approved successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error approving claim" });
  }
};

// Reject a claim
exports.rejectClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("waste");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Ensure only the provider who owns the waste can reject
    if (claim.waste.createdBy.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to reject this claim" });
    }

    claim.status = "rejected";
    await claim.save();

    res.json({ message: "Claim rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error rejecting claim" });
  }
};

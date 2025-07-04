const Claim = require("../models/Claim");
const Waste = require("../models/Waste");
const Notification = require("../models/Notification");

// Create a claim
exports.createClaim = async (req, res) => {
  try {
    const { message } = req.body;
    const wasteId = req.params.id;

    const waste = await Waste.findById(wasteId).populate("createdBy");
    if (!waste) {
      return res.status(404).json({ message: "Waste listing not found" });
    }

    const existingClaim = await Claim.findOne({
      waste: wasteId,
      collector: req.user.id,
      status: "pending"
    });

    if (existingClaim) {
      return res.status(400).json({ message: "You have already claimed this waste" });
    }
    
    const claim = await Claim.create({
      waste: wasteId,
      collector: req.user.id,
      message,
    });

    // Create notification for the provider
    await Notification.create({
    recipient: waste.createdBy._id,
    message: `New claim for your listing "${waste.title}".`,
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
      .populate("waste");

    res.json(claims);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error fetching my claims" });
  }
};

exports.getClaimsForProvider = async (req, res) => {
  try {
    console.log("Fetching claims for provider:", req.user);
    // Find all waste listings created by this provider
    const wastes = await Waste.find({ createdBy: req.user.id }).select("_id");

    const wasteIds = wastes.map((w) => w._id);

    // Get all claims for those listings
    const claims = await Claim.find({ waste: { $in: wasteIds } })
      .populate("collector", "name email")
      .populate("waste", "title status");

    res.json(claims);
  } catch (err) {
    console.error("Error fetching provider claims:", err);
    res.status(500).json({ message: "Server error fetching claims" });
  }
};

 
//Approve/Reject claims
// Approve a claim
exports.approveClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("waste");
    // console.log("Fetched claim:", claim);

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

    // Create notification
    await Notification.create({
      recipient: claim.collector,
      message: `Your claim for "${claim.waste.title}" has been approved.`,
    });
  
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

    await Notification.create({
      recipient: claim.collector,
      message: `Your claim for "${claim.waste.title}" has been rejected.`,
    });

    res.json({ message: "Claim rejected successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error rejecting claim" });
  }
};

// Collector confirms collection
exports.confirmCollected = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id).populate("collector").populate("waste");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    if (claim.collector._id.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to confirm this claim" });
    }

    // Update both claim and waste
    claim.collected = true;
    await claim.save();

    if (claim.waste) {
      claim.waste.status = "collected";
      await claim.waste.save();
    }

    res.json({ message: "Collection confirmed successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error confirming collection" });
  }
};

// Cancel a claim (collector)
exports.cancelClaim = async (req, res) => {
  try {
    const claim = await Claim.findById(req.params.id);

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Check if the claim belongs to the logged-in collector
    if (claim.collector.toString() !== req.user.id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this claim" });
    }

    // Only allow cancel if still pending
    if (claim.status !== "pending") {
      return res.status(400).json({ message: "Cannot cancel a claim that has been approved or rejected" });
    }

    // Delete the claim
    await claim.deleteOne();

    res.json({ message: "Claim cancelled successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error cancelling claim" });
  }
};

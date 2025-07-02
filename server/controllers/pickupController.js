const Pickup = require("../models/Pickup");
const Claim = require("../models/Claim");
const Notification = require("../models/Notification");

// Schedule a pickup (Collector schedules after claim accepted)
exports.schedulePickup = async (req, res) => {
  try {
    console.log("BODY:", req.body);

    const { wasteId, scheduledTime } = req.body;

    if (typeof scheduledTime !== "string" || !scheduledTime.trim()) {
  return res.status(400).json({ message: "Scheduled time is required" });
}

    // Find the claim
    const claim = await Claim.findOne({
      waste: wasteId,
      collector: req.user.id,
      status: "accepted"
    }).populate("waste");

    if (!claim) {
      return res.status(404).json({ message: "Claim not found" });
    }

    // Ensure the logged-in user is the collector who made the claim
    if (claim.collector.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to schedule pickup for this claim" });
    }

    // Ensure the claim was accepted 
    if (claim.status !== "accepted") {
      return res.status(400).json({ message: "Pickup can only be scheduled after claim is accepted" });
    }

    // Check if pickup already exists for this claim
    const existingPickup = await Pickup.findOne({ claim: claim._id });
    if (existingPickup) {
      return res.status(400).json({ message: "Pickup already scheduled for this claim" });
    }

    // Create pickup
    const pickup = await Pickup.create({
      claim: claim._id,
      waste: claim.waste._id,
      collector: claim.collector,
      provider: claim.waste.createdBy,
      scheduledTime,
      status: "scheduled",
    });

    // Notify the provider
    await Notification.create({
      recipient: claim.waste.createdBy,
      message: `Pickup scheduled by collector for "${claim.waste.title}" at ${new Date(scheduledTime).toLocaleString()}.`,
    });

    res.status(201).json({ message: "Pickup scheduled successfully", pickup });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error scheduling pickup" });
  }
};

// Mark pickup as completed (Provider marks after collection)
exports.completePickup = async (req, res) => {
  try {
    const pickupId = req.params.id;

    const pickup = await Pickup.findById(pickupId);
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }

    // Ensure the logged-in user is the provider
    if (pickup.provider.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to complete this pickup" });
    }

    pickup.status = "completed";
    await pickup.save();

    res.json({ message: "Pickup marked as completed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error completing pickup" });
  }
};

// (Optional) Get pickups for the logged-in user (collector or provider)
exports.getMyPickups = async (req, res) => {
  try {
    const pickups = await Pickup.find({
      $or: [{ collector: req.user.id }, { provider: req.user.id }],
    })
      .populate("waste", "title")
      .populate("collector", "name email")
      .populate("provider", "name email");

    res.json(pickups);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching pickups" });
  }
}; 
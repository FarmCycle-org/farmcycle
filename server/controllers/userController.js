const User = require('../models/User');
const Claim = require("../models/Claim");
const Notification = require("../models/Notification");
const Waste = require("../models/Waste");

// Get logged-in user's profile
exports.getMyProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching profile" });
  }
};

// Update logged-in user's profile
exports.updateMyProfile = async (req, res) => {
  try {
    const updates = {
      name: req.body.name,
      contact: req.body.contact,
      // organization: req.body.organization
    };
    //skip updating org if not provided
    if (req.body.organization !== undefined) {
      updates.organization = req.body.organization;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      { new: true, runValidators: true }
    ).select("-password");

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating profile" });
  }
};

// Change logged-in user's password
exports.changePassword = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    const { currentPassword, newPassword } = req.body;

    if (!await user.matchPassword(currentPassword)) {
      return res.status(400).json({ message: "Current password is incorrect" });
    }

    user.password = newPassword;
    await user.save();

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error changing password" });
  }
};

// Upload profile picture
exports.uploadProfilePicture = async (req, res) => {
  try {
    // multer adds the file info in req.file
    if (!req.file || !req.file.path) {
      return res.status(400).json({ message: "No image provided" });
    }

    // Update user's profilePic URL in DB
    req.user.profilePictureUrl = req.file.path;
    await req.user.save();

    res.json({
      message: "Profile picture updated successfully",
      profilePictureUrl: req.user.profilePictureUrl,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error uploading profile picture" });
  }
};

//delete profile pic
exports.deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user.profilePictureUrl) {
      return res.status(400).json({ message: "No profile picture to delete" });
    }

    // Optional: delete from Cloudinary by public ID
    // You need to store public_id separately if you want to do this

    user.profilePictureUrl = "";
    await user.save();

    res.json({ message: "Profile picture removed" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error removing profile picture" });
  }
};

// Delete logged-in user's account and related data (On-cascade Delete)
exports.deleteMyAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    //if collector
    await Claim.deleteMany({ collector: userId });

    //if provider
    const wastes = await Waste.find({ createdBy: userId });
    const wasteIds = wastes.map((w) => w._id);
    await Claim.deleteMany({ waste: { $in: wasteIds } });
    await Waste.deleteMany({ createdBy: userId });

    // Delete all notifications sent to this user
    await Notification.deleteMany({ recipient: userId });

    await User.findByIdAndDelete(userId);

    res.json({ message: "Account deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting account" });
  }
};


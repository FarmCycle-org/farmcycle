const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const { protect } = require("../middleware/authMiddleware");
const parser = require("../config/multer");

// Get my profile
router.get("/me", protect, userController.getMyProfile);

// Update my profile
router.put("/me", protect, userController.updateMyProfile);

// Change my password
router.put("/me/password", protect, userController.changePassword);

// Upload profile picture
router.post(
  "/me/profile-picture",protect,
  parser.single("image"), // "image" should match the frontend form field name
  userController.uploadProfilePicture
);

// Delete profile picture
router.delete("/me/profile-picture",protect,userController.deleteProfilePicture);

// Delete my account
router.delete("/me", protect, userController.deleteMyAccount);

//save/update user location
router.patch("/location", protect, userController.updateLocation);

module.exports = router;

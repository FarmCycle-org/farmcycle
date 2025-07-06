const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const { protect } = require("../middleware/authMiddleware");

// Get my notifications
router.get("/", protect, notificationController.getMyNotifications);

// Mark as read
router.put("/:id/read", protect, notificationController.markAsRead);

//delete 
router.delete("/:id", protect, notificationController.deleteNotification);

module.exports = router;

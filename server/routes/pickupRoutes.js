const express = require("express");
const router = express.Router();
const pickupController = require("../controllers/pickupController");
const { protect } = require("../middleware/authMiddleware");

// Collector schedules pickup
router.post("/", protect, pickupController.schedulePickup);

// Provider marks pickup completed
router.put("/:id/complete", protect, pickupController.completePickup);

// (Optional) Get all pickups for logged-in user
router.get("/my", protect, pickupController.getMyPickups);

module.exports = router;

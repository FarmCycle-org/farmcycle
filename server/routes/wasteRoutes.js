const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");
const { protect } = require("../middleware/authMiddleware");

// Create waste (provider only)
router.post("/", protect, wasteController.createWaste);

// Get all waste
router.get("/", wasteController.getAllWaste);

// Get waste listings by the logged-in provider
router.get("/my", protect, wasteController.getMyWaste);

// Get waste by ID
router.get("/:id", wasteController.getWasteById);

// Delete waste (provider only)
router.delete("/:id", protect, wasteController.deleteWaste);

//Mark waste as collected
router.put("/:id/collected", protect, wasteController.markAsCollected);

// Get all wastes created by the logged-in provider
router.get("/my/listings", protect, wasteController.getMyListings);

module.exports = router;

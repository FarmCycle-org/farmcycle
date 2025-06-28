const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");
const { protect } = require("../middleware/authMiddleware");

// Create waste (provider only)
router.post("/", protect, wasteController.createWaste);

// Get all waste
router.get("/", wasteController.getAllWaste);

// Get waste by ID
router.get("/:id", wasteController.getWasteById);

// Delete waste (provider only)
router.delete("/:id", protect, wasteController.deleteWaste);

module.exports = router;

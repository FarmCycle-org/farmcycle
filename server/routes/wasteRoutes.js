const express = require("express");
const router = express.Router();
const wasteController = require("../controllers/wasteController");
const { protect } = require("../middleware/authMiddleware");
const parser = require("../config/multer");

// Create waste (provider only)
router.post("/", protect,parser.single("image"), wasteController.createWaste);

//Edit waste
router.put("/:id", protect,parser.single("image"), wasteController.updateWaste);

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

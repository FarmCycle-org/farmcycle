const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

// Create review
router.post("/", protect, reviewController.createReview);

// Get reviews for a provider
router.get("/:id", reviewController.getReviewsForProvider);

// Update review
router.put("/:id", protect, reviewController.updateReview);

// Delete review
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;

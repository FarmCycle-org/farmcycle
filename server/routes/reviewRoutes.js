const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const reviewController = require("../controllers/reviewController");

// Create review
router.post("/", protect, reviewController.createReview);

// Get all reviews by the current collector
router.get("/my", protect, reviewController.getMyReviews);

// Get reviews for a provider
router.get("/provider/:id", reviewController.getReviewsForProvider);

// Get average rating for a provider
router.get("/provider/:id/average", reviewController.getAverageRatingForProvider);

// Delete review
router.delete("/:id", protect, reviewController.deleteReview);

module.exports = router;

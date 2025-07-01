const Review = require("../models/Review");
const User = require("../models/User");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { providerId, rating, comment } = req.body;

    if (!providerId || !rating) {
      return res.status(400).json({ message: "providerId and rating are required" });
    }

    // Ensure provider exists
    const provider = await User.findById(providerId);
    if (!provider) {
      return res.status(404).json({ message: "Provider not found" });
    }

    // Prevent duplicate reviews by the same collector
    const existingReview = await Review.findOne({
      provider: providerId,
      collector: req.user.id,
    });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this provider" });
    }

    const review = await Review.create({
      provider: providerId,
      collector: req.user.id,
      rating,
      comment,
    });

    res.status(201).json(review);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creating review" });
  }
};

// Get all reviews for a provider
exports.getReviewsForProvider = async (req, res) => {
  try {
    const providerId = req.params.id;
    const reviews = await Review.find({ provider: providerId })
      .populate("collector", "name email")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching reviews" });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.collector.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to edit this review" });
    }

    if (req.body.rating !== undefined) review.rating = req.body.rating;
    if (req.body.comment !== undefined) review.comment = req.body.comment;

    await review.save();

    res.json({ message: "Review updated", review });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error updating review" });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const reviewId = req.params.id;
    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.collector.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    await review.deleteOne();

    res.json({ message: "Review deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error deleting review" });
  }
};

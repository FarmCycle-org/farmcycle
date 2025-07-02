const mongoose = require("mongoose");
const Review = require("../models/Review");
const Pickup = require("../models/Pickup");

// Create a review
exports.createReview = async (req, res) => {
  try {
    const { pickupId, rating, comment } = req.body;

    if (!pickupId || !rating) {
      return res.status(400).json({ message: "pickupId and rating are required" });
    }

    // Find the pickup
    const pickup = await Pickup.findById(pickupId).populate("waste");
    if (!pickup) {
      return res.status(404).json({ message: "Pickup not found" });
    }
    // Ensure this pickup belongs to the logged-in collector
    if (pickup.collector.toString() !== req.user.id) {
      return res
        .status(403)
        .json({ message: "You are not authorized to review this pickup" });
    }
    // Ensure pickup is completed
    if (pickup.status !== "completed") {
      return res
        .status(400)
        .json({ message: "You can only review after pickup is completed" });
    }
    // Prevent duplicate review for this pickup
    const existingReview = await Review.findOne({ pickup: pickupId });
    if (existingReview) {
      return res
        .status(400)
        .json({ message: "You have already reviewed this pickup" });
    }

    const review = await Review.create({
      pickup: pickup._id,
      waste: pickup.waste._id,
      provider: pickup.provider,
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
      .populate("waste", "title")
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

//compute average rating 
exports.getAverageRatingForProvider = async (req, res) => {
  try {
    const providerId = req.params.id;

    const result = await Review.aggregate([
      { $match: { provider: new mongoose.Types.ObjectId(providerId) } },
      {
        $group: {
          _id: "$provider",
          avgRating: { $avg: "$rating" },
          numReviews: { $sum: 1 },
        },
      },
    ]);

    if (result.length === 0) {
      return res.json({ avgRating: null, numReviews: 0 });
    }

    res.json({
      avgRating: result[0].avgRating,
      numReviews: result[0].numReviews,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating average rating" });
  }
};


const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    pickup: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Pickup",
      required: true,
      unique: true, // One review per pickup
    },
    waste: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Waste",
      required: true,
    },
    provider: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", reviewSchema);

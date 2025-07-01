const mongoose = require("mongoose");

const wasteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please add a title"],
    },
    description: {
      type: String,
    },
    quantity: {
      type: String,
    },
    wasteType: {
      type: String,
      enum: ["organic", "plastic", "metal", "paper", "e-waste", "other"],
      required: true,
    },
    location: {
      // GeoJSON Point
      type: {
        type: String,
        enum: ["Point"],
        default: "Point",
      },
      coordinates: {
        type: [Number], // [longitude, latitude]
        required: true,
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    imageUrl: { type: String },
    status: {
    type: String,
    enum: ["available", "collected"],
    default: "available",
  },
  },
  {
    timestamps: true,
  }
);

wasteSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("Waste", wasteSchema);

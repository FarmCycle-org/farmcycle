const mongoose = require("mongoose");

const claimSchema = new mongoose.Schema(
  {
    waste: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Waste",
      required: true,
    },
    collector: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    //optional message
    message: {
      type: String,
    },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected"],
      default: "pending",
    },
    collected: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Claim", claimSchema);

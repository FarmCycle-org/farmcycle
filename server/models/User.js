const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['provider', 'collector'], required: true },
  contact: String,
  location: {
    type: { type: String, default: "Point" },
    coordinates: [Number], // [lng, lat]
  }
}, { timestamps: true });

userSchema.index({ location: "2dsphere" });

module.exports = mongoose.model("User", userSchema);

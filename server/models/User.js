const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['provider', 'collector'], required: true },
  contact: String,
  location: {
  type: {
    type: String,
    enum: ['Point'],
    // required:true,
    // default: 'Point'
  },
  coordinates: {
    type: [Number],
    // required:true,

  }
}
}, { timestamps: true });

userSchema.index({ location: "2dsphere" },{ sparse: true }); //index will only include documents that have the location field. If a document doesn't have a location field, it won't be indexed.

module.exports = mongoose.model("User", userSchema);

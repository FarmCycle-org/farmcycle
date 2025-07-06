// models/User.js (Updated Schema)
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['provider', 'collector'], required: true },
  contact: String,
  // Add userType field for conditional logic
  userType: { type: String, enum: ['individual', 'organization'], required: true }, // IMPORTANT: Add this field
  organization: {
    type: String,
    enum: [
      'restaurant', 'hotel', 'catering service', 'school/university', 'corporate office',
      'solo', 'household', 'grocery store', 'vendor', 'factory', 'farm',
      'recycling center', 'composting unit', 'environmental NGO'
    ],
    default: 'solo', // Default to 'solo' if not explicitly provided
    // Conditionally required: Only required if userType is 'organization'
    required: function() {
      return this.userType === 'organization';
    }
  },
  profilePictureUrl: {
    type: String,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  }
}, { timestamps: true });

userSchema.index({ location: "2dsphere" }, { sparse: true });

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");


// const userSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
//   role: { type: String, enum: ['provider', 'collector'], required: true },
//   contact: String,
//   organization: {type: String, enum: ['restaurant', 'hotel','catering service', 'school/university','corporate office', 'solo', 'household',
//      'grocery store', 'vendor', 'factory', 'farm', 'recycling center', 'composting unit', 'environmental NGO'], default: 'solo', required: true} ,
//   profilePictureUrl: { 
//     type: String,
//   },
//   location: {
//   type: {
//     type: String,
//     enum: ['Point'],
//     // required:true,
//     // default: 'Point'
//   },
//   coordinates: {
//     type: [Number],
//     // required:true,

//   }
// }
// }, { timestamps: true });

// userSchema.index({ location: "2dsphere" },{ sparse: true }); //index will only include documents that have the location field. If a document doesn't have a location field, it won't be indexed.

// userSchema.pre("save", async function (next) {
//   if (!this.isModified("password")) {
//     return next();
//   }
//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return await bcrypt.compare(enteredPassword, this.password);
// };

// module.exports = mongoose.model("User", userSchema);

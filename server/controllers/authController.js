// server/controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  console.log("Received registration request with body:", req.body);
  try {
    const {
      name,
      email,
      password,
      role,
      contact,
      organization,
      userType,
      location
    } = req.body;

    if (!email || !password || !name || !role || !contact || !userType) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // ❌ DO NOT hash password manually
    const userData = {
      name,
      email,
      password, // Keep as plain text, Mongoose hook will hash it
      role,
      contact,
      organization,
      userType
    };

    if (
      location &&
      location.type === "Point" &&
      Array.isArray(location.coordinates) &&
      location.coordinates.length === 2
    ) {
      userData.location = location;
    }

    const user = await User.create(userData); // password will be hashed automatically

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d"
    });

    res.status(201).json({
      message: "Successful register",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        userType: user.userType
      }
    });
  } catch (err) {
    console.error("Registration error:", err);
    res.status(500).json({ message: "Registration failed. Try again." });
  }
};



const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt:", { email, password }); // 🪵 log input

    const user = await User.findOne({ email });
    if (!user) {
    //   console.log("❌ No user found for:", email);
      return res.status(400).json({ message: "User not found" });
    }

    console.log("Entered password:", password);
    console.log("Type of password:", typeof password);
    console.log("Password length:", password.length);
    // console.log("✅ User found:", user.email);
    // console.log("🔐 Hashed password in DB:", user.password);
    // console.log("🔑 Entered password:", password);

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
    //   console.log("❌ Password mismatch for:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    // console.log("✅ Password matched. Generating token for:", email);

    res.status(200).json({
      message: "Successful login",
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    console.error("🔥 Login error:", err);
    res.status(500).json({ message: err.message });
  }
};


module.exports = { registerUser, loginUser };

//original
// const bcrypt = require("bcryptjs");
// const jwt = require("jsonwebtoken");
// const User = require("../models/User");

// const registerUser = async (req, res) => {
//     console.log("Received registration request with body:", req.body);
//   try {
//     const { name, email, password, role, contact, organization, location } = req.body; //// Destructure location here too

//     const existingUser = await User.findOne({ email });
//     if (existingUser) return res.status(400).json({ message: "User already exists" });

//     const hashedPassword = await bcrypt.hash(password, 10);


//     const userData = { // Create a temporary object for user data
//       name,
//       email,
//       password: hashedPassword,
//       role,
//       contact,
//       organization
//     };
//     // ONLY add the location field if it's provided AND has coordinates
//     if (location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
//       userData.location = location;
//     }

//     const user = await User.create(userData); // Create with the conditional data

//     // const user = await User.create({
//     //   name,
//     //   email,
//     //   password: hashedPassword,
//     //   role,
//     //   contact,
//     // });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(201).json({
//       message: "Successfull register",
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     console.error("Registration error:", err); // Log the full error for debugging
//     res.status(501).json({ message: err.message });
//   }
// };

// const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     const user = await User.findOne({ email });
//     if (!user) return res.status(400).json({ message: "User not found" });

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

//     const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
//       expiresIn: "7d",
//     });

//     res.status(200).json({
//       message: "Successfull login",
//       token,
//       user: { id: user._id, name: user.name, email: user.email, role: user.role },
//     });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

// module.exports = { registerUser, loginUser };

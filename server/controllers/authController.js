// server/controllers/authController.js

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
    console.log("Received registration request with body:", req.body);
    try {
        // Ensure userType is destructured here
        const { name, email, password, role, contact, organization, userType, location } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const userData = { // Create a temporary object for user data
            name,
            email,
            password: hashedPassword,
            role,
            contact,
            organization,
            userType // <--- ADD THIS LINE!
        };

        // ONLY add the location field if it's provided AND has coordinates
        if (location && location.type === 'Point' && Array.isArray(location.coordinates) && location.coordinates.length === 2) {
            userData.location = location;
        }

        const user = await User.create(userData); // Create with the conditional data

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(201).json({
            message: "Successful register",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role, userType: user.userType }, // Optionally include userType in response
        });
    } catch (err) {
        console.error("Registration error:", err); // Log the full error for debugging
        res.status(501).json({ message: err.message });
    }
};

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "User not found" });

        console.log("Login attempt for:", email);
console.log("Entered password:", password);
console.log("Hashed in DB:", user.password);

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
            expiresIn: "7d",
        });

        res.status(200).json({
            message: "Successful login",
            token,
            user: { id: user._id, name: user.name, email: user.email, role: user.role ,userType: user.userType,},
        });
    } catch (err) {
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

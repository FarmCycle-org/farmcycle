require("dotenv").config();

//const dotenv = require("dotenv");
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

//routes
const authRoutes = require("./routes/authRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const claimRoutes = require("./routes/claimRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const userRoutes = require("./routes/userRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const pickupRoutes = require("./routes/pickupRoutes");

//dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());


// Homepage route
app.get("/", (req, res) => {
  res.send("🌱 FarmCycle API Running");
});

app.use("/api/auth", authRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/claims", claimRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/users", userRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/pickups", pickupRoutes);


// Centralized error handler
app.use((err, req, res, next) => {
  console.error("Error handler caught:", err);

  // Multer file upload errors
  if (err.name === "MulterError") {
    return res.status(400).json({ message: err.message });
  }

  // Cloudinary upload errors
  if (err.http_code && err.http_code >= 400) {
    return res.status(err.http_code).json({ message: err.message });
  }

  // Other errors
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

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

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const courseRoutes = require("./routes/courseRouter");
const instructorRoutes = require("./routes/instructorRouter");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/courses", courseRoutes);
app.use("/api/instructors", instructorRoutes);

// Root check
app.get("/", (req, res) => {
  res.json({ message: "Admin Dashboard API is running!" });
});

// Connect to MongoDB and start server
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI,{ family: 4 })
  .then(() => {
    console.log("✅ MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error:", err.message);
  });
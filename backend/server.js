const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const repoRoutes = require("./routes/repoRoutes");
require("dotenv").config();

const app = express();
// Middleware
app.use(
  cors({
    origin: [
      "https://collaborative-workspace-platform-3.onrender.com",
      "http://localhost:5173",
    ], // ✅ Allow frontend URLs
    methods: "GET,POST,PUT,DELETE,OPTIONS", // ✅ Allow necessary methods
    allowedHeaders: ["Content-Type", "Authorization"], // ✅ Allow headers
    credentials: true, // ✅ Allow cookies & authentication headers
  })
);
app.use(express.json());

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/repos", repoRoutes);

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articleRoutes");
const commentRoutes = require("./routes/commentRoutes");

const app = express();

// Middleware
app.use(express.json());

// Middleware
app.use(cors());
app.use(express.json());

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/comments", commentRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

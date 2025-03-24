import "dotenv/config"; // Menggantikan require("dotenv").config();
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

const app = express();

// Middleware
app.use(express.json());

// Global rate limit
import limiter from "./middleware/rateLimit.js";
app.use(limiter);

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/comments.js";
import categoriesRoutes from "./routes/categories.js";
import tagsRoutes from "./routes/tags.js";

// Register API routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/tag", tagsRoutes);

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error(err));

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

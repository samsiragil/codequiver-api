require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const mongoose = require("mongoose");

// Import routes
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/userRoutes");
const articleRoutes = require("./routes/articles");
const commentRoutes = require("./routes/commentRoutes");
const categoriesRoutes = require('./routes/categories');
const tagsRoutes = require('./routes/tags');

const app = express();

// Middleware
app.use(express.json());

// Global rate limit
const limiter = require("./middlewares/rateLimit");
app.use(limiter);


// Middleware
app.use(cors());
app.use(express.json());

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

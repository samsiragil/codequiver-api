// server.js

import "dotenv/config";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import limiter from "./middleware/rateLimit.js";

// Import routes
import authRoutes from "./routes/auth.js";
import userRoutes from "./routes/users.js";
import articleRoutes from "./routes/articles.js";
import commentRoutes from "./routes/comments.js";
import likeRoutes from "./routes/likes.js";
import categoriesRoutes from "./routes/categories.js";
import tagsRoutes from "./routes/tags.js";

const app = express();

app.use(express.json());
app.use(cors());
app.use(limiter);

// Register routes
app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/article", articleRoutes);
app.use("/api/comment", commentRoutes);
app.use("/api/like", likeRoutes);
app.use("/api/category", categoriesRoutes);
app.use("/api/tag", tagsRoutes);

// Export app for testing
export default app;

// Connect to DB and run the server if not in test environment
if (process.env.NODE_ENV !== "test") {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
      const PORT = process.env.PORT || 5000;
      app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch((err) => console.error("MongoDB connection error:", err));
}

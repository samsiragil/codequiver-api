import express from "express";
import Like from "../models/Likes.js";
import Article from "../models/Articles.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

router.put("/:articleId/like", authMiddleware, async (req, res) => {
  const userId = req.user.id;
  const articleId = req.params.articleId;

  try {
    // Try to find and remove an existing like
    const existing = await Like.findOneAndDelete({ user: userId, article: articleId });
    if (existing) {
      // Decrement likeCount
      await Article.findByIdAndUpdate(articleId, { $inc: { likeCount: -1 } });
      return res.json({ message: "Like removed" });
    }

    // Otherwise create a new like
    await Like.create({ user: userId, article: articleId });
    await Article.findByIdAndUpdate(articleId, { $inc: { likeCount: 1 } });
    res.json({ message: "Article liked" });

  } catch (error) {
    // Handle duplicate key (shouldn't happen due to unique index, but just in case)
    if (error.code === 11000) {
      return res.status(400).json({ message: "You have already liked this article" });
    }
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
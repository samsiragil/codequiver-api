import express from "express";
import Comment from "../models/Comments.js";
import Article from "../models/Articles.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();
// Get comments related to the article
router.get("/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;

    // Get top-level comments
    const comments = await Comment.find({ article: articleId, parentComment: null, deletedAt: null })
      .populate("author")
      .sort({ createdAt: -1 });

    // Fetch replies for each comment
    const commentsWithReplies = await Promise.all(
      comments.map(async (comment) => {
        const replies = await Comment.find({ parentComment: comment._id, deletedAt: null })
          .populate("author")
          .sort({ createdAt: 1 });

        return { ...comment.toObject(), replies };
      })
    );

    res.json({ totalComments: comments.length, comments: commentsWithReplies });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Create a comment
router.post("/:articleId", authMiddleware, async (req, res) => {
  try {
    const { articleId } = req.params;
    const { content } = req.body;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Create and save comment
    const newComment = await Comment.create({
      content,
      author: req.user.id,
      article: articleId,
    });

    res.json({ message: "Comment added", comment: newComment });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete comment 
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only the comment author or an admin can delete
    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    comment.deletedAt = new Date();
    await comment.save();

    res.json({ message: "Comment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Reply Comment
router.post("/:articleId/reply/:commentId", authMiddleware, async (req, res) => {
  try {
    const { articleId, commentId } = req.params;
    const { content } = req.body;

    // Check if article exists
    const article = await Article.findById(articleId);
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Check if parent comment exists
    const parentComment = await Comment.findById(commentId);
    if (!parentComment) return res.status(404).json({ message: "Parent comment not found" });

    // Create reply
    const reply = await Comment.create({
      content,
      author: req.user.id,
      article: articleId,
      parentComment: commentId,
    });

    res.json({ message: "Reply added successfully", reply });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete Reply Comment
router.delete("/:commentId", authMiddleware, async (req, res) => {
  try {
    const { commentId } = req.params;
    const comment = await Comment.findById(commentId);

    if (!comment) return res.status(404).json({ message: "Comment not found" });

    // Only author or admin can delete
    if (comment.author.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Soft delete the comment
    comment.deletedAt = new Date();
    await comment.save();

    res.json({ message: "Comment deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


export default router;


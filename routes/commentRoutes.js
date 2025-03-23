const express = require("express");
const Comment = require("../models/Comment");

const router = express.Router();

// Get comments for an article
router.get("/:articleId", async (req, res) => {
  try {
    const comments = await Comment.find({ article: req.params.articleId }).populate("author", "username");
    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

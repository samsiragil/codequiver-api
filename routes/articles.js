const express = require("express");
const Article = require("../models/Articles");
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const router = express.Router();

// Create new article
router.post("/", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { title, slug, content, description, category, tags, status, editorContent } = req.body;
    const newArticle = new Article({
      title,
      slug,
      description,
      content,
      category,
      tags,
      status,
      editorContent,
      author: req.user.id, // Save admin ID as author
    });

    await newArticle.save();
    res.status(201).json({ message: "Article created successfully", article: newArticle });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update article
router.put("/:id", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    Object.assign(article, req.body);
    await article.save();

    res.json({ message: "Article updated successfully", article });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Delete article
router.delete("/:id", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);
    if (!article) return res.status(404).json({ message: "Article not found" });

    await article.deleteOne();
    res.json({ message: "Article deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().populate("author");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single article by slug
router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate("author");
    if (!article) return res.status(404).json({ message: "Article not found" });

    // Increment views
    article.views++;
    await article.save();

    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

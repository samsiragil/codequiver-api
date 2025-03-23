const express = require("express");
const Article = require("../models/Article");

const router = express.Router();

// Get all articles
router.get("/", async (req, res) => {
  try {
    const articles = await Article.find().populate("author", "username");
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single article by slug
router.get("/:slug", async (req, res) => {
  try {
    const article = await Article.findOne({ slug: req.params.slug }).populate("author", "username");
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

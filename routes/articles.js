import express from "express";
import Article from "../models/Articles.js";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";

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

    article.deletedAt = new Date(); // Mark as deleted
    await article.save();
    res.json({ message: "Article deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Restore deleted article
router.put("/restore/:id", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const article = await Article.findById(id);

    if (!article) return res.status(404).json({ message: "Article not found" });
    if (!article.deletedAt) return res.status(400).json({ message: "Article is not deleted" });

    article.deletedAt = null; // Restore the article
    await article.save();

    res.json({ message: "Article restored successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});


// Get all articles
router.get("/", async (req, res) => {
  try {
    let { page = 1, limit = 10 } = req.query;
    page = parseInt(page);
    limit = parseInt(limit);

    const totalArticles = await Article.countDocuments({ deletedAt: null });
    const articles = await Article.find({ deletedAt: null })
      .populate("author", "name")
      .skip((page - 1) * limit)
      .limit(limit);

    res.json({
      totalArticles,
      totalPages: Math.ceil(totalArticles / limit),
      currentPage: page,
      articles,
    });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
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

export default router;

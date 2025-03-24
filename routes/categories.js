const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const authorize = require("../middleware/authorize");
const Category = require("../models/Categories");

// ✅ Admin can create category
router.post("/", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { name, description, slug } = req.body;
    const newCategory = new Category({ name, description, slug, author : req.user.id });
    await newCategory.save();
    res.status(201).json({ message: "Category created successfully", category: newCategory });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Admin can update category
router.put("/:id", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.name = req.body.name || category.name;
    category.slug = req.body.slug || category.slug;
    category.description = req.body.description || category.description;
    await category.save();

    res.json({ message: "Category updated successfully", category });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Admin can delete category
router.delete("/:id", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    category.deletedAt = new Date(); // Mark as deleted
    await category.save();
    res.json({ message: "Category deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Users can view all categories
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find().populate("author");
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;
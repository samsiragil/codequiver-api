import express from "express";
import authMiddleware from "../middleware/authMiddleware.js";
import authorize from "../middleware/authorize.js";
import Tag from "../models/Tags.js";

const router = express.Router();
// ✅ Admin can create tag
router.post("/", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { name, slug } = req.body;
    const newTag = new Tag({ name, slug, author : req.user.id });
    await newTag.save();
    res.status(201).json({ message: "Tag created successfully", Tag: newTag });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Admin can update Tag
router.put("/:id", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findById(id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });
    tag.name = req.body.name || tag.name;
    tag.slug = req.body.slug || tag.slug;
    await tag.save();

    res.json({ message: "Tag updated successfully", Tag });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Admin can delete Tag
router.delete("/:id", authMiddleware, authorize(["admin"]), async (req, res) => {
  try {
    const { id } = req.params;
    const tag = await Tag.findById(id);
    if (!tag) return res.status(404).json({ message: "Tag not found" });

    tag.deletedAt = new Date(); // Mark as deleted
    await tag.save();
    res.json({ message: "Tag deleted successfully" });

  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// ✅ Users can view all tags
router.get("/", async (req, res) => {
  try {
    const tags = await Tag.find().populate("author");
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

export default router;
import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: Object, required: true },
    editorContent: { type: Object },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Users" }],
    comments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Comments" }],
    views: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Article", ArticleSchema);

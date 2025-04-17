import mongoose from "mongoose";

const ArticleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    description: { type: String },
    content: { type: Object, required: true },
    editorContent: { type: Object },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    category: { type: String, required: true },
    tags: [{ type: String }],
    status: { type: String, enum: ["published", "draft"], default: "draft" },
    likeCount: { type: Number, default: 0 }, 
    views: { type: Number, default: 0 },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Articles", ArticleSchema);

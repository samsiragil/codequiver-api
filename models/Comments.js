import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Article", required: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Comment", CommentSchema);

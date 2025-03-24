import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema(
  {
    content: { type: String, required: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "Users", required: true },
    article: { type: mongoose.Schema.Types.ObjectId, ref: "Articles", required: true },
    parentComment: { type: mongoose.Schema.Types.ObjectId, ref: "Comments", default: null },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Comments", CommentSchema);

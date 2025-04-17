// models/Like.js
import mongoose from "mongoose";

const LikeSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true
    },
    article: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Articles",
      required: true
    }
  },
  { timestamps: true }
);

// Ensure one like per user per article
LikeSchema.index({ user: 1, article: 1 }, { unique: true });

export default mongoose.model("Likes", LikeSchema);

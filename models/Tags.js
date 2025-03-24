import mongoose from "mongoose";

const TagsSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    deletedAt: { type: Date, default: null }
  },
  { timestamps: true }
);

export default mongoose.model("Tags", TagsSchema);

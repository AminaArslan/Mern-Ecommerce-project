import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: "Category", default: null }, // reference parent category
    isActive: { type: Boolean, default: true },
    metaTitle: { type: String, default: "" },
    metaDescription: { type: String, default: "" },
    canonicalUrl: { type: String, default: "" },
    image: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("Category", categorySchema);

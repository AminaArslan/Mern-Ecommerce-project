import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";

dotenv.config();
const DB = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(DB)
  .then(() => console.log("MongoDB Connected Successfully"))
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });

const parents = [
  { name: "Women", slug: "women", parentId: null },
  { name: "Men", slug: "men", parentId: null },
  { name: "Kids", slug: "kids", parentId: null },
];

const createParentsAndUpdateSubcategories = async () => {
  try {
    // 1️⃣ Ensure parents exist
    for (const parent of parents) {
      const exists = await Category.findOne({ name: parent.name });
      if (!exists) {
        await Category.create(parent);
        console.log(`Inserted parent category: ${parent.name}`);
      } else {
        console.log(`Parent category already exists: ${parent.name}`);
      }
    }

    // 2️⃣ Get parent documents
    const women = await Category.findOne({ name: "Women" });
    const men = await Category.findOne({ name: "Men" });
    const kids = await Category.findOne({ name: "Kids" });

    // 3️⃣ Update subcategories
    const updates = [
      { parentName: "Women", parentId: women._id },
      { parentName: "Men", parentId: men._id },
      { parentName: "Kids", parentId: kids._id },
    ];

    for (const u of updates) {
      const res = await Category.updateMany(
        { parentName: u.parentName, parentId: null },
        { parentId: u.parentId }
      );
      console.log(`Updated ${res.modifiedCount} subcategories for ${u.parentName}`);
    }

    console.log("✅ All subcategories are now correctly attached to parents!");
    process.exit(0);
  } catch (err) {
    console.error("Error updating categories:", err);
    process.exit(1);
  }
};

createParentsAndUpdateSubcategories();

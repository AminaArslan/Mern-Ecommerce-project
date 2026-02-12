import mongoose from "mongoose";
import dotenv from "dotenv";
import Category from "../models/Category.js";
import Product from "../models/Product.js";

dotenv.config();
const DB = process.env.MONGO_URI;

// Connect to MongoDB
mongoose.connect(DB)
    .then(() => console.log("MongoDB Connected Successfully"))
    .catch((err) => {
        console.error("MongoDB connection failed:", err.message);
        process.exit(1);
    });

const validateProductsCategories = async () => {
    try {
        // 1️⃣ Fetch all categories
        const categories = await Category.find({ isActive: true });
        const categoryMap = {};
        categories.forEach(cat => {
            categoryMap[cat._id.toString()] = { name: cat.name, slug: cat.slug, parentId: cat.parentId };
        });

        // 2️⃣ Fetch all products
        const products = await Product.find({}).populate("category", "name slug parentId");

        let mismatchCount = 0;

        products.forEach(product => {
            if (!product.category) {
                console.log(`⚠️ Product "${product.name}" has no category assigned!`);
                mismatchCount++;
                return;
            }

            const catId = product.category._id.toString();
            const catData = categoryMap[catId];

            if (!catData) {
                console.log(`⚠️ Product "${product.name}" has invalid category ID: ${catId}`);
                mismatchCount++;
                return;
            }

            // Optional: check if parentId is null for subcategories
            if (catData.parentId === null && product.category.name !== catData.name) {
                console.log(`⚠️ Product "${product.name}" seems linked to a parent category instead of a subcategory`);
                mismatchCount++;
            }
        });

        if (mismatchCount === 0) {
            console.log("✅ All products categories are correctly assigned!");
        } else {
            console.log(`⚠️ Total mismatched products: ${mismatchCount}`);
        }

        process.exit(0);

    } catch (err) {
        console.error("Error validating products categories:", err);
        process.exit(1);
    }
};

validateProductsCategories();

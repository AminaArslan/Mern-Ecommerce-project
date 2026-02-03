import Category from "../models/Category.js";
import Product from "../models/Product.js";
import slugify from "slugify";

// ---------------- Create  Category (Admin) ----------------
export const createCategory = async (req, res) => {
  try {
    const { name, parentId, isActive, metaTitle, metaDescription, canonicalUrl, image } = req.body;

    if (!name) return res.status(400).json({ message: "Category name is required" });

    // ParentId is required for subcategories
    if (!parentId) return res.status(400).json({ message: "Subcategory must have a parent category" });

    const parentCategory = await Category.findById(parentId);
    if (!parentCategory || parentCategory.parentId) {
      return res.status(400).json({ message: "Invalid parent category" });
    }

    // Prevent duplicate subcategory under same parent
    const existing = await Category.findOne({ name, parentId });
    if (existing) return res.status(400).json({ message: "Subcategory already exists under this parent" });

    const category = await Category.create({
      name,
      slug: slugify(name, { lower: true }),
      parentId,
      isActive: isActive !== undefined ? isActive : true,
      metaTitle: metaTitle || "",
      metaDescription: metaDescription || "",
      canonicalUrl: canonicalUrl || "",
      image: image || "",
    });

    res.status(201).json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get All Categories (Admin) ----------------
// Existing function
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// 2️⃣ New function – latest subcategories grouped by parent with products
export const getNewSubcategoriesByParent = async (req, res) => {
  try {
    const parents = await Category.find({ parentId: null, isActive: true });

    const data = await Promise.all(
      parents.map(async (parent) => {
        const subcategories = await Category.aggregate([
          { $match: { parentId: parent._id, isActive: true } },
          {
            $lookup: {
              from: "products",         // collection name
              localField: "_id",        // Category _id
              foreignField: "category", // Product.category field
              as: "products",
            },
          },
          { $match: { "products.0": { $exists: true } } }, // only subcategories with products
          { $sort: { createdAt: -1 } },                    // latest subcategories
          { $limit: 4 },
          {
            $project: {
              name: 1,
              slug: 1,
              image: 1,
              products: {
                $map: {
                  input: "$products",
                  as: "p",
                  in: {
                    _id: "$$p._id",
                    name: "$$p.name",
                    slug: "$$p.slug",
                    images: "$$p.images",
                    price: "$$p.price",
                  },
                },
              },
            },
          },
        ]);

        return {
          parentName: parent.name,
          parentSlug: parent.slug,
          subcategories,
        };
      })
    );

    res.json(data);
  } catch (err) {
    console.error("getNewSubcategoriesByParent error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
// ---------------- Update Category ----------------
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, parentId, isActive, metaTitle, metaDescription, canonicalUrl, image } = req.body;

    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Prevent updating parentId of parent categories
    if (parentId) {
      const parentCategory = await Category.findById(parentId);
      if (!parentCategory || parentCategory.parentId) {
        return res.status(400).json({ message: "Invalid parent category" });
      }
      category.parentId = parentId;
    }

    category.name = name || category.name;
    category.slug = name ? slugify(name, { lower: true }) : category.slug;
    category.isActive = isActive !== undefined ? isActive : category.isActive;
    category.metaTitle = metaTitle || category.metaTitle;
    category.metaDescription = metaDescription || category.metaDescription;
    category.canonicalUrl = canonicalUrl || category.canonicalUrl;
    category.image = image || category.image;

    await category.save();
    res.json(category);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Delete Category ----------------
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findById(id);
    if (!category) return res.status(404).json({ message: "Category not found" });

    // Prevent deleting parent categories
    if (!category.parentId) return res.status(400).json({ message: "Cannot delete parent category" });

    await category.deleteOne();
    res.json({ message: "Subcategory deleted" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

// ---------------- Get Categories for Users ----------------
export const getCategoriesForUsers = async (req, res) => {
  try {
    const categories = await Category.find({ isActive: true }).sort({ name: 1 });

    // Structure: parent categories with subcategories
    const parents = categories.filter(c => !c.parentId);
    const structured = parents.map(parent => ({
      ...parent.toObject(),
      subCategories: categories.filter(c => c.parentId?.toString() === parent._id.toString())
    }));

    res.json(structured);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};

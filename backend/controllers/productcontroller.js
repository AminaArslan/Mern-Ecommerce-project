import Product from "../models/Product.js";
import slugify from "slugify";
import cloudinary from "../config/cloudinary.js";
import Order from "../models/Order.js";
import Category from "../models/Category.js"
/* ================= CREATE PRODUCT (ADMIN) ================= */
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, quantity, category, isActive } = req.body;

    // Validation
    if (!name || !price || !quantity || !category) {
      return res.status(400).json({ message: "Required fields missing" });
    }

    // Upload images to Cloudinary
    let imageArray = [];
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        imageArray.push({
          public_id: uploaded.public_id,
          url: uploaded.secure_url,
        });
      }
    }

    // Create Product
    const product = await Product.create({
      name,
      slug: slugify(name),
      description,
      price,
      quantity,
      category,
      // subCategory, // store subcategory as product category
      isActive: isActive ?? true,
      images: imageArray,
      createdBy: req.user?._id,
    });

    res.status(201).json(product);
  } catch (error) {
    console.error("Error creating product:", error);
    res.status(500).json({ message: error.message });
  }
};

/* ================= GET ALL ACTIVE PRODUCTS (PUBLIC) ================= */

export const getProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const { search, category, sort, order, minPrice, maxPrice } = req.query;

    // 🔎 Build dynamic query
    const query = { isActive: true };

    // ✅ Search by PRODUCT NAME
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    // ✅ Filter by CATEGORY
    if (category) {
      // Check if category is a valid ObjectId (direct ID match)
      let catObj = null;

      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        catObj = await Category.findById(category);
      } else {
        // Find category by slug or Word Boundary name
        catObj = await Category.findOne({
          $or: [
            { slug: category },
            { name: { $regex: `\\b${category}\\b`, $options: "i" } }
          ]
        });
      }

      if (catObj) {
        // 🌟 NEW LOGIC: Get all subcategories of this parent
        const subCategories = await Category.find({ parentId: catObj._id });
        const categoryIds = subCategories.map(sc => sc._id);
        categoryIds.push(catObj._id); // Include the parent itself

        // Filter by ANY of these IDs
        query.category = { $in: categoryIds };
      } else {
        // If category not found, return NO products
        return res.status(200).json({
          products: [],
          totalPages: 0,
          currentPage: page,
          total: 0
        });
      }
    }

    // ✅ Filter by PRICE
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // ✅ Dynamic Sorting
    let sortOptions = { createdAt: -1 }; // Default
    if (sort) {
      sortOptions = { [sort]: order === 'asc' ? 1 : -1 };
    }

    const [products, total] = await Promise.all([
      Product.find(query)
        .populate("category", "name slug")
        .sort(sortOptions)
        .skip(skip)
        .limit(limit),

      Product.countDocuments(query),
    ]);

    res.status(200).json({
      products,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total,
    });
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


/* ================= GET SINGLE PRODUCT ================= */
export const getSingleProduct = async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  }).populate("category", "name slug");

  if (!product)
    return res.status(404).json({ message: "Product not found" });

  res.json(product);
};

/* ================= ADMIN: GET ALL PRODUCTS ================= */
export const getAllProductsAdmin = async (req, res) => {
  const products = await Product.find()
    .populate("category", "name")
    .sort({ createdAt: -1 });

  res.json(products);
};

// ===== Get Top 5 Best Selling Products (Admin Dashboard) ===== //
export const getTopProducts = async (req, res) => {
  try {
    const stats = await Order.aggregate([
      { $unwind: "$orderItems" },
      {
        $group: {
          _id: "$orderItems.product",    // product id
          totalSold: { $sum: "$orderItems.quantity" }
        }
      },
      { $sort: { totalSold: -1 } },
      { $limit: 5 },  // top 5
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      { $unwind: "$productInfo" },
      {
        $project: {
          _id: "$productInfo._id",
          name: "$productInfo.name",
          price: "$productInfo.price",
          quantity: "$productInfo.quantity",
          images: "$productInfo.images",
          totalSold: 1
        }
      }
    ]);

    res.json(stats);
  } catch (err) {
    console.error("Top products error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
/* ================= UPDATE PRODUCT (ADMIN) ================= */
export const updateProduct = async (req, res) => {
  try {
    console.log('BODY:', req.body);
    console.log('FILES:', req.files);

    const product = await Product.findById(req.params.id);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const {
      name,
      description,
      price,
      quantity,
      category,
      isActive,
      removedImages,
      imageIndexes,
    } = req.body;

    // ---------------- BASIC INFO ----------------
    if (name) {
      product.name = name;
      product.slug = slugify(name);
    }

    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (quantity !== undefined) product.quantity = quantity;
    if (category !== undefined) product.category = category;

    if (isActive !== undefined) {
      product.isActive = isActive === "true" || isActive === true;
    }

    // ---------------- DELETE REMOVED IMAGES ----------------
    let removed = [];
    if (removedImages) {
      try {
        removed = JSON.parse(removedImages);
      } catch {
        removed = [];
      }

      for (const public_id of removed) {
        await cloudinary.uploader.destroy(public_id);
      }

      product.images = product.images.filter(
        img => !removed.includes(img.public_id)
      );
    }

    // ---------------- HANDLE NEW UPLOADS ----------------
    if (req.files && req.files.length > 0) {
      let indexes = [];

      if (imageIndexes) {
        indexes = Array.isArray(imageIndexes) ? imageIndexes : [imageIndexes];
      }

      for (let i = 0; i < req.files.length; i++) {
        const file = req.files[i];
        const index = indexes[i] !== undefined ? parseInt(indexes[i]) : -1;

        const uploaded = await cloudinary.uploader.upload(file.path, {
          folder: "products",
        });

        // Replace existing image
        if (index >= 0 && product.images[index]) {
          await cloudinary.uploader.destroy(product.images[index].public_id);

          product.images[index] = {
            public_id: uploaded.public_id,
            url: uploaded.secure_url,
          };
        } else {
          // Add new image
          product.images.push({
            public_id: uploaded.public_id,
            url: uploaded.secure_url,
          });
        }
      }
    }

    await product.save();

    res.json({ success: true, product });

  } catch (err) {
    console.error('UPDATE PRODUCT ERROR:', err); // <-- this is key
    res.status(500).json({ message: 'Internal Server Error', error: err.message });
  }
};

/* ================= DELETE PRODUCT (ADMIN) ================= */
export const deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  if (product.image?.public_id) {
    await cloudinary.uploader.destroy(product.image.public_id);
  }

  await product.deleteOne();
  res.json({ message: "Product deleted successfully" });
};

/* ================= TOGGLE ACTIVE / INACTIVE ================= */
export const toggleProductStatus = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Product not found" });

  product.isActive = !product.isActive;
  await product.save();

  res.json({
    message: product.isActive ? "Product Activated" : "Product Deactivated",
    isActive: product.isActive,
  });
};

/* ===== Products by Category (Admin Dashboard Pie Chart) ===== */
export const getProductsByParentCategory = async (req, res) => {
  try {
    const stats = await Product.aggregate([
      // Only active products
      { $match: { isActive: true } },

      // Lookup category info
      {
        $lookup: {
          from: "categories",
          localField: "category",
          foreignField: "_id",
          as: "categoryInfo",
        },
      },
      { $unwind: "$categoryInfo" },

      // Only active categories
      { $match: { "categoryInfo.isActive": true } },

      // Lookup parent category
      {
        $lookup: {
          from: "categories",
          localField: "categoryInfo.parentId",
          foreignField: "_id",
          as: "parentInfo",
        },
      },
      {
        $addFields: {
          parent: { $arrayElemAt: ["$parentInfo", 0] },
        },
      },

      // Determine final category name (parent if exists, else self)
      {
        $group: {
          _id: {
            $cond: [
              { $ifNull: ["$parent", false] },
              "$parent.name",
              "$categoryInfo.name",
            ],
          },
          qty: { $sum: 1 },
        },
      },

      // Project for frontend
      {
        $project: {
          category: "$_id",
          qty: 1,
          _id: 0,
        },
      },
      { $sort: { qty: -1 } },
    ]);

    res.json(stats);
  } catch (err) {
    console.error("Products by parent category error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

/* ================= GET PRODUCTS BY PARENT CATEGORY ================= */
export const getProductsByParentCategoryFrontend = async (req, res) => {
  const { slug } = req.params;

  // 🔎 Find category by slug (case-insensitive) OR ID
  let parentCategory = null;
  if (slug.match(/^[0-9a-fA-F]{24}$/)) {
    parentCategory = await Category.findById(slug);
  } else {
    parentCategory = await Category.findOne({
      $or: [
        { slug: slug },
        { name: { $regex: `\\b${slug}\\b`, $options: "i" } }
      ],
      isActive: true
    });
  }

  if (!parentCategory) return res.status(404).json({ message: "Category not found" });

  const subCategories = await Category.find({ parentId: parentCategory._id, isActive: true });
  const categoryIds = subCategories.map(cat => cat._id);
  categoryIds.push(parentCategory._id);

  const products = await Product.find({ category: { $in: categoryIds }, isActive: true })
    .populate("category", "name slug image")
    .sort({ createdAt: -1 });

  res.status(200).json(products);
};

  import express from "express";
  import {
    createProduct,
    getProducts,
    getSingleProduct,
    getAllProductsAdmin,
    updateProduct,
    deleteProduct,
    toggleProductStatus,
    getTopProducts,
    getProductsByParentCategory,
    getProductsByParentCategoryFrontend,
  } from "../controllers/productcontroller.js";

  import { protect } from "../middleware/authmiddleware.js";
  import { isAdmin } from "../middleware/roleMiddleware.js";
  import upload from "../middleware/upload.js";

  const router = express.Router();

  /* ===== PUBLIC ===== */
  router.get("/", getProducts);
  router.get("/admin/all", protect, isAdmin, getAllProductsAdmin); // admin route must be before :slug
  router.get("/:slug", getSingleProduct);
  // Fetch products by parent category for frontend
router.get("/frontend/:slug", getProductsByParentCategoryFrontend);

  /* ===== ADMIN ===== */
router.post(
  "/admin/create",
  protect,
  isAdmin,
  upload.array("images", 4), // max 4 images
  createProduct
);


  
  router.put(
    "/admin/update/:id",
    protect,
    isAdmin,
    upload.array("images", 4),
    updateProduct
  );

  router.delete("/admin/delete/:id", protect, isAdmin, deleteProduct);

  router.patch(
    "/admin/toggle/:id",
    protect,
    isAdmin,
    toggleProductStatus
  );
  router.patch(
  "/admin/toggle/:id",
  protect,
  isAdmin,
  toggleProductStatus
);

  export default router;

  router.get("/admin/parent-category-stats", protect, isAdmin, getProductsByParentCategory);

  router.get("/admin/top-products", protect, isAdmin, getTopProducts);
import express from "express";
import { protect } from "../middleware/authmiddleware.js"; // Auth middleware
import {
  getCart,
  syncCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// ---------------- Public ----------------
// Cart is user-specific, so all routes require auth

// ---------------- Protected (login users only) ----------------
router.use(protect);

// Get logged-in user's cart
router.get("/", getCart);

// Sync entire frontend cart (create/update)
router.post("/sync", syncCart);

// Update quantity of single product
router.patch("/item/:productId", updateCartItem);

// Remove single product from cart
router.delete("/item/:productId", removeCartItem);

// Clear entire cart
router.delete("/", clearCart);

export default router;

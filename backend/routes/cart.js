import express from "express";
import {
  getCart,
  syncCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// ---------------- Cart Routes ----------------

// Get cart (guest or logged-in)
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

import express from "express";

import { protect } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";
import { 
  createOrder, 
  getAllOrdersAdmin, 
  getMyOrders, 
  getOrderById, 
  getOrdersWeeklyStats, 
  updateOrderStatus,
  getPendingOrdersAdmin,        // ← Added
  getPendingOrdersCountAdmin    // ← Added
} from "../controllers/ordercontroller.js";

const router = express.Router();

/* ===== CUSTOMER ===== */
router.post("/", protect, createOrder);           // Create new order
router.get("/myorders", protect, getMyOrders);   // Customer orders
router.get("/:id", protect, getOrderById);       // Single order

/* ===== ADMIN ===== */
router.get("/admin/all", protect, isAdmin, getAllOrdersAdmin);           // All orders
router.patch("/admin/status/:id", protect, isAdmin, updateOrderStatus); // Update status
router.get("/admin/weekly", protect, isAdmin, getOrdersWeeklyStats);    // Weekly stats

// ===== PENDING ORDERS =====
router.get("/admin/pending", protect, isAdmin, getPendingOrdersAdmin);         // All pending orders
router.get("/admin/pending/count", protect, isAdmin, getPendingOrdersCountAdmin); // Pending orders count

export default router;

import express from "express";
import { protect } from "../middleware/authmiddleware.js";
import { createCheckoutSession, stripeWebhook } from "../controllers/paymentController.js";

const router = express.Router();

/* Stripe Webhook */
router.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  stripeWebhook
);

/* Checkout Session */  
router.post("/create-session", protect, createCheckoutSession);

export default router;
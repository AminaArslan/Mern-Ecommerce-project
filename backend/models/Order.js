import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    orderItems: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        image: { type: String },
      },
    ],

    shippingAddress: {
      firstName: { type: String },
      lastName: { type: String },
      email: { type: String },
      phone: { type: String },
      address: { type: String, required: true },
      city: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "Stripe"],
      default: "Stripe",
    },

    // 🔹 Stripe payment details (optional)
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
    },

    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },

    // ✅ DELIVERY STATUS
    orderStatus: {
      type: String,
      enum: ["pending", "shipped", "delivered", "cancelled", "canceled"], 
      default: "pending",
    },

    // 🔹 Who canceled the order (null if not canceled)
    cancelledBy: {
      type: String,
      enum: ["user", "admin", null],
      default: null,
    },

    // ✅ PAYMENT STATUS
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"], 
      default: "pending",
    },

    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

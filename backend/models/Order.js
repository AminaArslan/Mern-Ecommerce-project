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
        name: String,
        quantity: Number,
        price: Number,
        image: String,
      },
    ],
    shippingAddress: {
      address: String,
      city: String,
      postalCode: String,
      country: String,
    },
    paymentMethod: { type: String, default: "Stripe" },
    paymentResult: {
      id: String,
      status: String,
      email_address: String,
    },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, required: true, default: 0.0 },
    status: {
      type: String,
      enum: ["pending", "paid", "shipped", "delivered", "canceled"],
      default: "pending",
    },
    isPaid: { type: Boolean, default: false },
    paidAt: Date,
    deliveredAt: Date,
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);

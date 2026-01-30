import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  name: { type: String, required: true },       // snapshot of product name
  image: { type: String },                      // snapshot of product image
  quantity: { type: Number, default: 1 },
  price: { type: Number, required: true },     // snapshot of product price
});

// Main cart schema
const cartSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // logged-in user
    guestId: { type: String },                                    // for guests (cookie-based)
    items: [cartItemSchema],
    expiresAt: { type: Date },                                    // optional, for manual expiry control
  },
  { timestamps: true }
);

// TTL index: guest carts expire after 3 days
cartSchema.index(
  { expiresAt: 1 },
  { partialFilterExpression: { guestId: { $exists: true } } }
);

// Pre-save hook to auto-set expiresAt for guest carts
cartSchema.pre("save", function () {
  if (this.guestId) {
    this.expiresAt = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000); // 3 days from now
  }
  
});

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);

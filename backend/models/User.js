import mongoose from "mongoose";

// User schema
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    role: {
      type: String,
      enum: ["admin", "customer"], // only these two roles
      default: "customer",
    },
    isActive: {
      type: Boolean,
      default: true, // can deactivate users if needed
    },
    avatar: {
      type: String, // optional profile picture URL
    },
    cart: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number, default: 1 },
        addedAt: { type: Date, default: Date.now }, // optional for tracking
      },
    ],
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Optional: helper methods to check role
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

userSchema.methods.isCustomer = function () {
  return this.role === "customer";
};

// Optional: method to clear cart
userSchema.methods.clearCart = function () {
  this.cart = [];
  return this.save();
};

export default mongoose.models.User || mongoose.model("User", userSchema);

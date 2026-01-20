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
  },
  {
    timestamps: true, // adds createdAt and updatedAt automatically
  }
);

// Optional: helper method to check role
userSchema.methods.isAdmin = function () {
  return this.role === "admin";
};

userSchema.methods.isCustomer = function () {
  return this.role === "customer";
};

export default mongoose.model("User", userSchema);

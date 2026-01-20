// Import core modules
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";

// Import routes
import authRoutes from "./routes/auth.js";
import categoryRoutes from "./routes/category.js";
import productRoutes from "./routes/product.js";
import orderRoutes from "./routes/order.js";
import adminRoutes from "./routes/admin.js";
import cartRoutes from "./routes/cart.js";
import paymentRoutes from "./routes/payment.js";

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// ---------------- Middleware ----------------

// Allow requests from both localhost and deployed frontend
const allowedOrigins = [
  "http://localhost:3000", // Local development
  "https://mern-ecommerce-project-bqcr.vercel.app" // Deployed frontend
];

app.use(cors({
  origin: function(origin, callback) {
    // allow requests with no origin (like Postman or curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = `CORS policy: The origin ${origin} is not allowed.`;
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
}));

app.use(express.json()); // parse JSON bodies

// ---------------- Basic Test Route ----------------
app.get("/", (req, res) => {
  res.send("API is running...");
});

// ----------------- Routes -----------------
app.use("/api/auth", authRoutes);       // Login/Register
app.use("/api/categories", categoryRoutes);   // Categories CRUD
app.use("/api/products", productRoutes);      // Products CRUD
app.use("/api/orders", orderRoutes);          // Orders CRUD + status
app.use("/api/admin", adminRoutes);
app.use("/api/cart", cartRoutes);
app.use("/payments", paymentRoutes);

// ---------------- Global Error Handler ----------------
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server Error" });
});

// ---------------- Start Server ----------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

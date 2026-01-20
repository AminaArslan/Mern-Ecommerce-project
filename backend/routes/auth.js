import express from "express";
import { registerUser, login, getAllUsers, deleteUser } from "../controllers/authcontroller.js";
import { protect } from "../middleware/authmiddleware.js";
import { isAdmin } from "../middleware/roleMiddleware.js";

const router = express.Router();

// ------------------ Registration ------------------
// Always creates a customer
router.post("/register", registerUser);

// ------------------ Login ------------------
router.post("/login", login);

// ------------------ Admin Only: Get All Users ------------------
router.get("/users", protect, isAdmin, getAllUsers);

// ------------------ Admin Only: Delete a Customer ------------------
router.delete("/users/:id", protect, isAdmin, deleteUser);

export default router;

  import express from "express";
  import { protect } from "../middleware/authmiddleware.js";
  import { isAdmin } from "../middleware/roleMiddleware.js";
import {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  getCategoriesForUsers,
} from "../controllers/categorycontroller.js";

const router = express.Router();

router.get("/", getCategoriesForUsers);
// ---------------- Admin Routes ----------------
router.use(protect);
router.use(isAdmin);

router.get("/all", getAllCategories);
router.post("/", createCategory);
router.put("/:id", updateCategory);
router.delete("/:id", deleteCategory);


export default router;

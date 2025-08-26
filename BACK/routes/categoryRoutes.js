import express from "express";
import { getAllCategories, getCategoryById, createCategory, updateCategory, deleteCategory } from "../controllers/categoryController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllCategories);
router.get("/:id", getCategoryById);
router.post("/", authMiddleware, authorizeRoles("admin"), createCategory);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateCategory);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteCategory);

export default router;
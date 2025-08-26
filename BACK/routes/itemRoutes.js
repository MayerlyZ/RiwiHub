import express from "express";
import { getAllItems, getItemById, createItem, updateItem, deleteItem } from "../controllers/itemController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", getAllItems);
router.get("/:id", getItemById);
router.post("/", authMiddleware, authorizeRoles("seller", "admin"), createItem);
router.put("/:id", authMiddleware, authorizeRoles("seller", "admin"), updateItem);
router.delete("/:id", authMiddleware, authorizeRoles("seller", "admin"), deleteItem);

export default router;

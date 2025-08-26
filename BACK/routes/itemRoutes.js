import e from "express";
import {getAllItems, getItemById, createItem, updateItem, deleteItem } from "../controllers/itemController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
//
const router = e.Router();

router.get("/", authMiddleware, getAllItems);
router.get("/:id", authMiddleware, getItemById);
router.post("/", authMiddleware, createItem);
router.put("/:id", authMiddleware, updateItem);
router.delete("/:id", authMiddleware, deleteItem);

export default router;

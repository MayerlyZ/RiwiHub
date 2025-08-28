import express from "express";
import { getAllItems, getItemById, createItem, updateItem, deleteItem} from "../controllers/itemController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// ======================
// Rutas públicas (buyers)
// ======================
router.get("/", getAllItems);        // Cualquiera puede listar productos
router.get("/:id", getItemById);     // Cualquiera puede ver un producto específico

// ======================
// Rutas protegidas (admin + seller)
// ======================
router.post("/", authMiddleware, authorizeRoles("admin", "seller"), createItem);
router.put("/:id", authMiddleware, authorizeRoles("admin", "seller"), updateItem);
router.delete("/:id", authMiddleware, authorizeRoles("admin", "seller"), deleteItem);

export default router;

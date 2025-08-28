// BACK/routes/inventoryRoutes.js

import e from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

import {
  createInventory,
  listInventory,
  getInventory,
  updateInventoryController,
  deleteInventoryController,
  lowStockAlert,
} from "../controllers/inventoryController.js";

const router = e.Router();

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// CRUD
router.post("/", authorizeRoles("admin", "seller"), createInventory);
router.get("/", authorizeRoles("admin", "seller"), listInventory);
router.get("/:id", authorizeRoles("admin", "seller"), getInventory);
router.put("/:id", authorizeRoles("admin", "seller"), updateInventoryController);
router.delete("/:id", authorizeRoles("admin"), deleteInventoryController);

// Alertas
router.get("/alerts/low-stock", authorizeRoles("admin", "seller"), lowStockAlert);

export default router;

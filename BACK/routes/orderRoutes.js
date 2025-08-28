import express from "express";
import { getAllOrders, getOrderById, createOrder, updateOrder, deleteOrder } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getAllOrders);
router.get("/:id", authMiddleware, authorizeRoles("buyer", "admin"), getOrderById);
router.post("/", authMiddleware, authorizeRoles("buyer", "admin"), createOrder);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateOrder);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteOrder);

export default router;

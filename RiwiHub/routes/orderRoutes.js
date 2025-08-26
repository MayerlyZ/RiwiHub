import express from "express";
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} from "../controllers/orderController.js";

const router = express.Router();

// Create a new order
router.post("/", createOrder);

// Get order by ID
router.get("/:id", getOrderById);

// Update order status
router.put("/:id/status", updateOrderStatus);

// Get all orders
router.get("/", getAllOrders);

export default router;
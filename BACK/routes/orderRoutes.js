import e from "express";
import { getAllOrders, getOrderById, createOrder,updateOrder, deleteOrder } from "../controllers/orderController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router.get("/", authMiddleware, getAllOrders);
router.get("/:id", authMiddleware, getOrderById);
router.post("/", authMiddleware, createOrder);
router.put("/:id", authMiddleware, updateOrder);
router.delete("/:id", authMiddleware, deleteOrder);

export default router;

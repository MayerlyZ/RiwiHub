import express from "express";
import { addItemToCart, removeItemFromCart, getCartContents } from "../controllers/cartController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.post("/add", authMiddleware, authorizeRoles("buyer", "admin"), addItemToCart);
router.delete("/remove/:id", authMiddleware, authorizeRoles("buyer", "admin"), removeItemFromCart);
router.get("/", authMiddleware, authorizeRoles("buyer", "admin"), getCartContents);

export default router;

import e from "express";
import { addItemToCart, removeItemFromCart, getCartContents } from "../controllers/cartController";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

router.post("/add", authMiddleware, addItemToCart);
router.delete("/remove/:id", authMiddleware, removeItemFromCart);
router.get("/", authMiddleware, getCartContents);

export default router;

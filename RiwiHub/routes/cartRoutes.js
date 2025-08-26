import express from "express";
import {
  addItemToCart,
  removeItemFromCart,
  getCartContents,
} from "../controllers/cartController.js";

const router = express.Router();

// Route to add an item to the cart
router.post("/", addItemToCart);

// Route to remove an item from the cart
router.delete("/:itemId", removeItemFromCart);

// Route to get the contents of the cart
router.get("/", getCartContents);

export default router;
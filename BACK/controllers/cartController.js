import * as cartService from "../services/cartService.js";
import { isPositiveNumber } from "../utils/validators.js";

//añadir item al carrito
export const addItemToCart = async (req, res) => {
  const user_id = req.user.id;
  const { item_id, quantity } = req.body;

  if(!item_id || !isPositiveNumber(quantity)) {
    return res.status(400).json({ message: "El item_id es requerido y debe ser un número positivo." });
  }
    try {
    const cartItem = await cartService.addItemToCart(user_id, item_id, quantity);
    res.status(201).json(cartItem);
  } catch (error) {
    res.status(500).json({ error: "Error al agregar item al carrito" });
  }

};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
  const user_id = req.user.id;
  const { id: item_id } = req.params;

  if (!item_id) {
    return res.status(400).json({ message: 'Item ID is required' });
  }

  try {
    const deleted = await cartService.removeItemFromCart(user_id, item_id);
    if (deleted) {
      res.status(200).json({ message: 'Item removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};

// Get cart contents
export const getCartContents = async (req, res) => {
  const user_id = req.user.id;
  
  try {
    const cart = await cartService.getCartByUserId(user_id); // Busca si el usuario tiene carrito

    if (cart) {
      res.status(200).json(cart.items); // Trae el carrito del usuario 
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cart contents', error });
  }
};
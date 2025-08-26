// cartController
import Cart from '../models/cartItem.js';

//añadir item al carrito
import { isPositiveNumber } from "../utils/validators.js";
export const addItemToCart = async (req, res) => {
  const { userId, productId, quantity } = req.body;
  if (!isPositiveNumber(Number(userId))) {
    return res.status(400).json({ message: "El userId es requerido y debe ser un número positivo." });
  }
  if (!isPositiveNumber(Number(productId))) {
    return res.status(400).json({ message: "El productId es requerido y debe ser un número positivo." });
  }
  if (!isPositiveNumber(Number(quantity))) {
    return res.status(400).json({ message: "La cantidad debe ser un número positivo." });
  }
  try {
    const cart = await Cart.findOne({ where: { userId } }); // Busca si el usuario tiene carrito

    if (cart) {
      // Update existing cart
      const itemIndex = cart.items.findIndex(item => item.productId === productId); // Busca si el producto ya está en el carrito
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity; // Suma la cantidad
      } else {
        cart.items.push({ productId, quantity }); // Si el producto no esta lo agrega
      }
      await cart.save();
    } else {
      // Create new cart
      const newCart = await Cart.create({  // Si no existe, crea un nuevo carrito
        userId,
        items: [{ productId, quantity }]
      });
    }

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart', error });
  }
};

// Remove item from cart
export const removeItemFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;
    const cart = await Cart.findOne({ where: { userId } }); // Busca si el usuario tiene carrito

    if (cart) {
      cart.items = cart.items.filter(item => item.productId !== productId); // Elimina el ítem del carrito
      await cart.save(); // Guarda el carrito actualizado
      res.status(200).json({ message: 'Item removed from cart successfully' });
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart', error });
  }
};

// Get cart contents
export const getCartContents = async (req, res) => {
  try {
    const { userId } = req.params;
    const cart = await Cart.findOne({ where: { userId } }); // Busca si el usuario tiene carrito

    if (cart) {
      res.status(200).json(cart.items); // Trae el carrito del usuario 
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cart contents', error });
  }
};
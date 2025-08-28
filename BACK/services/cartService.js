import CartItem from '../models/cartItem.js';
import ShoppingCart from '../models/shoppingCart.js'; // o cart.js, según tu proyecto

export const addItemToCart = async (user_id, item_id, quantity) => {

  // Find the user's cart
  let cart = await ShoppingCart.findOne({ where: { user_id } });

  // If the cart doesn't exist, create one
  if (!cart) {
    cart = await ShoppingCart.create({ user_id });
  }

  // Search for the cart item
  let cartItem = await CartItem.findOne({ where: { cart_id: cart.cart_id, item_id } });

  if (cartItem) {
    // If the item is already in the cart, update the quantity
    cartItem.quantity += quantity;
    await cartItem.save();
  } else {
    // If the item is not in the cart, add it
    cartItem = await CartItem.create({ cart_id: cart.cart_id, item_id, quantity });
  }
  return cartItem;
};

// Remove an item from the cart
export const removeItemFromCart = async (user_id, item_id) => {
  const cart = await ShoppingCart.findOne({ where: { user_id } });
  if (!cart) return null;
  const deleted = await CartItem.destroy({ where: { cart_id: cart.cart_id, item_id } });
 return deleted;
};

// Get the contents of the cart
export const getCartContents = async (user_id) => {
  const cart = await ShoppingCart.findOne({ where: { user_id } });
  if (!cart) return [];
  return await CartItem.findAll({ where: { cart_id: cart.cart_id } });
};

// Get the cart by user ID
export const getCartByUserId = async (user_id) => {
  return await ShoppingCart.findOne({ 
    where: { user_id }, 
    include: [{ model: CartItem, as: 'cartItems' }] });
};

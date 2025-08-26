import Cart from '../models/Cart.js'; // Assuming you have a Cart model defined

export const addItemToCart = async (userId, productId, quantity) => {
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    } else {
      const newCart = await Cart.create({
        userId,
        items: [{ productId, quantity }]
      });
      return newCart;
    }
    return cart;
  } catch (error) {
    throw new Error('Error adding item to cart: ' + error.message);
  }
};

export const removeItemFromCart = async (userId, productId) => {
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (cart) {
      cart.items = cart.items.filter(item => item.productId !== productId);
      await cart.save();
      return cart;
    }
    throw new Error('Cart not found');
  } catch (error) {
    throw new Error('Error removing item from cart: ' + error.message);
  }
};

export const getCartContents = async (userId) => {
  try {
    const cart = await Cart.findOne({ where: { userId } });
    if (!cart) {
      throw new Error('Cart not found');
    }
    return cart.items;
  } catch (error) {
    throw new Error('Error retrieving cart contents: ' + error.message);
  }
};
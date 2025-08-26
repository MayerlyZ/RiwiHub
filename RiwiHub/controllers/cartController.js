import Cart from '../models/Cart.js'; // Assuming you have a Cart model defined

// Add item to cart
export const addItemToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;
    const cart = await Cart.findOne({ where: { userId } });

    if (cart) {
      // Update existing cart
      const itemIndex = cart.items.findIndex(item => item.productId === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ productId, quantity });
      }
      await cart.save();
    } else {
      // Create new cart
      const newCart = await Cart.create({
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
    const cart = await Cart.findOne({ where: { userId } });

    if (cart) {
      cart.items = cart.items.filter(item => item.productId !== productId);
      await cart.save();
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
    const cart = await Cart.findOne({ where: { userId } });

    if (cart) {
      res.status(200).json(cart.items);
    } else {
      res.status(404).json({ message: 'Cart not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving cart contents', error });
  }
};
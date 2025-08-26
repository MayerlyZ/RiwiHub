import Order from '../models/Order.js'; // Import the Order model

// Create a new order
export const createOrder = async (orderData) => {
  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    throw new Error('Error creating order: ' + error.message);
  }
};

// Get order by ID
export const getOrderById = async (orderId) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  } catch (error) {
    throw new Error('Error fetching order: ' + error.message);
  }
};

// Update order status
export const updateOrderStatus = async (orderId, status) => {
  try {
    const order = await Order.findByPk(orderId);
    if (!order) {
      throw new Error('Order not found');
    }
    order.status = status;
    await order.save();
    return order;
  } catch (error) {
    throw new Error('Error updating order status: ' + error.message);
  }
};

// Get all orders
export const getAllOrders = async () => {
  try {
    const orders = await Order.findAll();
    return orders;
  } catch (error) {
    throw new Error('Error fetching orders: ' + error.message);
  }
};
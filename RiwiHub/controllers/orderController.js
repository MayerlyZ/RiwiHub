import Order from "../models/Order.js"; // Import the Order model
import OrderService from "../services/orderService.js"; // Import the Order service

// Create a new order
export const createOrder = async (req, res) => {
  try {
    const orderData = req.body;
    const newOrder = await OrderService.createOrder(orderData);
    res.status(201).json(newOrder);
  } catch (error) {
    res.status(500).json({ message: "Error creating order", error });
  }
};

// Get order details by ID
export const getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await OrderService.getOrderById(id);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(order);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving order", error });
  }
};

// Update order status
export const updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedOrder = await OrderService.updateOrderStatus(id, status);
    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }
    res.status(200).json(updatedOrder);
  } catch (error) {
    res.status(500).json({ message: "Error updating order status", error });
  }
};

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await OrderService.getAllOrders();
    res.status(200).json(orders);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving orders", error });
  }
};
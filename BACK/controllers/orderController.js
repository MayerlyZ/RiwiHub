import Order from "../models/order.js";
import { isPositiveNumber, isInEnum } from "../utils/validators.js";

// Get all orders.
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll();
    res.json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get order by ID
export const getOrderById = async (req, res) => {
  const { id } = req.params;
  try {
    const order = await Order.findByPk(id);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new order
export const createOrder = async (req, res) => {
  const { user_id, status, total_amount } = req.body;
  if (!isPositiveNumber(Number(user_id))) {
    return res.status(400).json({ error: "El user_id es requerido y debe ser un número positivo." });
  }
  if (!isInEnum(status, ["pending", "paid", "shipped", "completed", "cancelled"])) {
    return res.status(400).json({ error: "El status no es válido." });
  }
  if (!isPositiveNumber(Number(total_amount))) {
    return res.status(400).json({ error: "El total_amount debe ser un número positivo." });
  }
  try {
    const newOrder = await Order.create({
      user_id,
      status,
      total_amount,
    });
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update an order
export const updateOrder = async (req, res) => {
  const { id } = req.params;
  const { user_id, status, total_amount } = req.body;
  if (user_id !== undefined && !isPositiveNumber(Number(user_id))) {
    return res.status(400).json({ error: "El user_id debe ser un número positivo." });
  }
  if (status !== undefined && !isInEnum(status, ["pending", "paid", "shipped", "completed", "cancelled"])) {
    return res.status(400).json({ error: "El status no es válido." });
  }
  if (total_amount !== undefined && !isPositiveNumber(Number(total_amount))) {
    return res.status(400).json({ error: "El total_amount debe ser un número positivo." });
  }
  try {
    const [updated] = await Order.update(
      { user_id, status, total_amount },
      { where: { order_id: id } }
    );
    if (!updated) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order updated successfully" });
  } catch (error) {
    console.error("Error updating order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete an order
export const deleteOrder = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Order.destroy({ where: { order_id: id } });
    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

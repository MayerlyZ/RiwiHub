import * as orderServices from "../services/orderService.js";
import { isPositiveNumber, isInEnum } from "../utils/validators.js";

// Get all orders
export const getAllOrders = async (req, res) => {
  try {
    const orders = await orderServices.getAllOrders();
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
    const order = await orderServices.getOrderById(id);
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
  const { user_id, total_amount, status, payment_method } = req.body;
  if (!isPositiveNumber(Number(user_id))) {
    return res.status(400).json({ error: "El user_id es requerido y debe ser un número positivo." });
  }
  if (!isInEnum(status, ["pending", "paid", "shipped", "completed", "cancelled"])) {
    return res.status(400).json({ error: "El status no es válido." });
  }
  if (!isPositiveNumber(Number(total_amount))) {
    return res.status(400).json({ error: "El total_amount debe ser un número positivo." });
  }
  if (payment_method !== undefined && payment_method !== null && !isInEnum(payment_method, ["wallet", "credit_card", "cash"])) {
    return res.status(400).json({ error: "El método de pago no es válido." });
  }
  try {
    const newOrder = await orderServices.createOrder({
      user_id,
      total_amount,
      status,
      payment_method,
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
  if (payment_method !== undefined && payment_method !== null && !isInEnum(payment_method, ["wallet", "credit_card", "cash"])) {
    return res.status(400).json({ error: "El método de pago no es válido." });
  }

  const data = {};
  if (user_id !== undefined) {
    data.user_id = user_id;
  }
  if (status !== undefined) {
    data.status = status;
  }
  if (total_amount !== undefined) {
    data.total_amount = total_amount;
  }
  if (payment_method !== undefined) {
    data.payment_method = payment_method;
  }
  try {

    const [updatedOrder] = await orderServices.updateOrder(id, data);
    if (!updatedOrder) {
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
    const deleted = await orderServices.deleteOrder(id);
    if (!deleted) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json({ message: "Order deleted successfully" });
  } catch (error) {
    console.error("Error deleting order:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

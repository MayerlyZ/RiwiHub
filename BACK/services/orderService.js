import Order from '../models/order.js';

export const createOrder = async (orderData) => {
  const order = await Order.create(orderData);
  return order;
};

export const getAllOrders = async () => {
  return await Order.findAll();
};

export const getOrderById = async (id) => {
  return await Order.findByPk(id);
};

export const updateOrder = async (id, updateData) => {
  const [updated] = await Order.update(updateData, { where: { order_id: id } });
  if (!updated) return null;
  return await Order.findByPk(id);
};

export const deleteOrder = async (id) => {
  const order = await Order.findByPk(id);
  if (!order) return null;
  await order.destroy();
  return order;
};

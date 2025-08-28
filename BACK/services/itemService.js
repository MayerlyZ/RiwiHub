import Item from "../models/item.js";

// Get all items
export const getAllItems = async () => {
  return await Item.findAll();
};

// Get item by ID
export const getItemById = async (id) => {
  return await Item.findByPk(id);
};

// Create item
export const createItem = async ({ name, description, price, price_token, stock, type, category_id }) => {
  return await Item.create({ name, description, price, price_token, stock, type, category_id });
};

// Update item
export const updateItem = async (id, data) => {
  const [updated] = await Item.update(data, { where: { item_id: id } });
  if (!updated) return null;
  return await Item.findByPk(id);
};

// Delete item
export const deleteItem = async (id) => {
  return await Item.destroy({ where: { item_id: id } });
};

import Category from "../models/category";

// Get all categories
export const getAllCategories = async () => {
  return await Category.findAll();
};

// Get category by ID
export const getCategoryById = async (id) => {
  return await Category.findByPk(id);
};

// Create category
export const createCategory = async ({ name, description, parent_id }) => {
  return await Category.create({ name, description, parent_id });
};

// Update category
export const updateCategory = async (id, data) => {
  const [updated] = await Category.update(data, { where: { category_id: id } });
  if (!updated) return null;
  return await Category.findByPk(id);
};

// Delete category
export const deleteCategory = async (id) => {
  return await Category.destroy({ where: { category_id: id } });
};

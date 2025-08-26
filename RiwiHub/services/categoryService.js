import Category from '../models/Category.js';

const categoryService = {
  createCategory: async (data) => {
    try {
      const category = await Category.create(data);
      return category;
    } catch (error) {
      throw new Error('Error creating category: ' + error.message);
    }
  },

  getAllCategories: async () => {
    try {
      const categories = await Category.findAll();
      return categories;
    } catch (error) {
      throw new Error('Error fetching categories: ' + error.message);
    }
  },

  getCategoryById: async (id) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Category not found');
      }
      return category;
    } catch (error) {
      throw new Error('Error fetching category: ' + error.message);
    }
  },

  updateCategory: async (id, data) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Category not found');
      }
      await category.update(data);
      return category;
    } catch (error) {
      throw new Error('Error updating category: ' + error.message);
    }
  },

  deleteCategory: async (id) => {
    try {
      const category = await Category.findByPk(id);
      if (!category) {
        throw new Error('Category not found');
      }
      await category.destroy();
      return { message: 'Category deleted successfully' };
    } catch (error) {
      throw new Error('Error deleting category: ' + error.message);
    }
  }
};

export default categoryService;
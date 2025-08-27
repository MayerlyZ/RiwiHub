import * as categoryService from "../services/categoryService.js";
import { isNonEmptyString, isPositiveNumber } from "../utils/validators.js";

// get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// get category by id
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  if (!isPositiveNumber(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  try {
    const category = await categoryService.getCategoryById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// create category
export const createCategory = async (req, res) => {
  const { name, description, parent_id } = req.body;
  if (!isNonEmptyString(name) || !isNonEmptyString(description) || !isPositiveNumber(parent_id)) {
    return res.status(400).json({ error: "Invalid category data" });
  }

  try {
    const newCategory = await categoryService.createCategory({ name, description, parent_id });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// update category
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, parent_id } = req.body;

  if (!isPositiveNumber(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }
  if (name !== undefined && !isNonEmptyString(name)) {
    return res.status(400).json({ error: "Name must be a valid non-empty string" });
  }
  if (description !== undefined && !isNonEmptyString(description)) {
    return res.status(400).json({ error: "Description must be a valid non-empty string" });
  }
  if (parent_id !== undefined && !isPositiveNumber(parent_id)) {
    return res.status(400).json({ error: "Parent ID must be a positive number" });
  }

  const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (parent_id !== undefined) data.parent_id = parent_id;

  try {
    const updatedCategory = await categoryService.updateCategory(id, data);
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(updatedCategory);
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete category
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  if (!isPositiveNumber(id)) {
    return res.status(400).json({ error: "Invalid category ID" });
  }

  try {
    const deleted = await categoryService.deleteCategory(id);
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

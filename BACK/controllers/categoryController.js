import Category from "../models/category.js";
import { isNonEmptyString, isPositiveNumber } from "../utils/validators.js";

// Obtener todas las categorías
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    console.error("Error fetching categories:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Obtener una categoría por ID
export const getCategoryById = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByPk(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json(category);
  } catch (error) {
    console.error("Error fetching category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Crear una nueva categoría
export const createCategory = async (req, res) => {
  const { name, description, parent_id } = req.body;
  // Validaciones
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: "El nombre es requerido y debe ser un string válido." });
  }
  if (parent_id !== undefined && parent_id !== null && !isPositiveNumber(Number(parent_id))) {
    return res.status(400).json({ error: "El parent_id debe ser un número positivo o null." });
  }
  try {
    const newCategory = await Category.create({
      name,
      description,
      parent_id: parent_id ?? null,
    });
    res.status(201).json(newCategory);
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Actualizar una categoría
export const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, parent_id } = req.body;
  // Validaciones (solo si los campos vienen en el body)
  if (name !== undefined && !isNonEmptyString(name)) {
    return res.status(400).json({ error: "El nombre debe ser un string válido." });
  }
  if (parent_id !== undefined && parent_id !== null && !isPositiveNumber(Number(parent_id))) {
    return res.status(400).json({ error: "El parent_id debe ser un número positivo o null." });
  }
  try {
    const [updated] = await Category.update(
      { name, description, parent_id: parent_id ?? null },
      { where: { category_id: id } }
    );
    if (!updated) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category updated successfully" });
  } catch (error) {
    console.error("Error updating category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Eliminar una categoría
export const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await Category.destroy({ where: { category_id: id } });
    if (!deleted) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.json({ message: "Category deleted successfully" });
  } catch (error) {
    console.error("Error deleting category:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

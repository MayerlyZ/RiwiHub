import Item from "../models/item.js";
import { isNonEmptyString, isPositiveNumber, isInEnum } from "../utils/validators.js";

// ===========================
// GET ALL ITEMS (público)
// ===========================
export const getAllItems = async (req, res) => {
  try {
    const items = await Item.findAll();
    res.json(items);
  } catch (error) {
    console.error("Error fetching items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===========================
// GET ITEM BY ID (público)
// ===========================
export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findByPk(id); // Sequelize sabe que PK = item_id
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }
    res.json(item);
  } catch (error) {
    console.error("Error fetching item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===========================
// CREATE ITEM (admin y seller)
// ===========================
export const createItem = async (req, res) => {
  const { name, description, price, stock, type, category_id } = req.body;

  // 🔹 Validaciones de entrada
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: "El nombre es requerido y debe ser un string válido." });
  }
  if (!isPositiveNumber(Number(price))) {
    return res.status(400).json({ error: "El precio debe ser un número positivo." });
  }
  if (stock !== undefined && !isPositiveNumber(Number(stock))) {
    return res.status(400).json({ error: "El stock debe ser un número positivo." });
  }
  if (!isInEnum(type, ["product", "service"])) {
    return res.status(400).json({ error: "El tipo debe ser 'product' o 'service'." });
  }
  if (!isPositiveNumber(Number(category_id))) {
    return res.status(400).json({ error: "La categoría es requerida y debe ser un número positivo." });
  }

  try {
    const newItem = await Item.create({
      name,
      description,
      price,
      stock: stock ?? 0,
      type,
      category_id,
      // 🔹 si es seller, asigna automáticamente su propio id
      seller_id: req.user.role === "seller" ? req.user.id : req.body.seller_id,
    });
    res.status(201).json(newItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===========================
// UPDATE ITEM (admin y seller)
// ===========================
export const updateItem = async (req, res) => {
  const { id } = req.params;
  const { name, description, price, stock, type, category_id } = req.body;

  // 🔹 Validaciones de entrada (opcionales)
  if (name !== undefined && !isNonEmptyString(name)) {
    return res.status(400).json({ error: "El nombre debe ser un string válido." });
  }
  if (price !== undefined && !isPositiveNumber(Number(price))) {
    return res.status(400).json({ error: "El precio debe ser un número positivo." });
  }
  if (stock !== undefined && !isPositiveNumber(Number(stock))) {
    return res.status(400).json({ error: "El stock debe ser un número positivo." });
  }
  if (type !== undefined && !isInEnum(type, ["product", "service"])) {
    return res.status(400).json({ error: "El tipo debe ser 'product' o 'service'." });
  }
  if (category_id !== undefined && !isPositiveNumber(Number(category_id))) {
    return res.status(400).json({ error: "La categoría debe ser un número positivo." });
  }

  try {
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // 🔹 Permisos: seller solo puede editar sus productos
    if (req.user.role === "seller" && item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot edit another seller's product" });
    }

    await item.update({ name, description, price, stock, type, category_id });
    res.json({ message: "Item updated successfully" });
  } catch (error) {
    console.error("Error updating item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// ===========================
// DELETE ITEM (admin y seller)
// ===========================
export const deleteItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await Item.findByPk(id);
    if (!item) return res.status(404).json({ error: "Item not found" });

    // 🔹 Permisos: seller solo puede borrar sus productos
    if (req.user.role === "seller" && item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot delete another seller's product" });
    }

    await item.destroy();
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

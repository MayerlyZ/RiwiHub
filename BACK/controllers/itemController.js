import * as itemService from "../services/itemService.js";
import { isNonEmptyString, isPositiveNumber, isInEnum } from "../utils/validators.js";

// ===========================
// GET ALL ITEMS (público)
// ===========================
export const getAllItems = async (req, res) => {
  try {
    const items = await itemService.getAllItems();
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
    const item = await itemService.getItemById(id);
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
  const { name, description, price, stock, type, price_token, category_id, seller_id } = req.body;
  // Validaciones

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
  if(price_token !== undefined && price_token !== null && !isPositiveNumber(Number(price_token))) {
    return res.status(400).json({ error: "El price_token debe ser un número positivo o null." });
  }
  if (!isPositiveNumber(Number(category_id))) {
    return res.status(400).json({ error: "La categoría es requerida y debe ser un número positivo." });
  }
   if (!isPositiveNumber(Number(seller_id))) {
    return res.status(400).json({ error: "El seller_id es requerido y debe ser un número positivo." });
  }
    const data = {
      name,
      description,
      price,
      stock: stock ?? 0,
      type,
      price_token,
      category_id,
      seller_id: req.user.role === "seller" ? req.user.id : seller_id,
    };

  try {
    const newItem = await itemService.createItem(data);
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
  const { name, description, price, stock, type, price_token, category_id } = req.body;

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
  if (price_token !== undefined && price_token !== null && !isPositiveNumber(Number(price_token))) {
    return res.status(400).json({ error: "El price_token debe ser un número positivo o null." });
  }
  if (category_id !== undefined && !isPositiveNumber(Number(category_id))) {
    return res.status(400).json({ error: "La categoría debe ser un número positivo." });
  }

  // Construction of the data object
   const data = {};
  if (name !== undefined) data.name = name;
  if (description !== undefined) data.description = description;
  if (price !== undefined) data.price = price;
  if (stock !== undefined) data.stock = stock;
  if (type !== undefined) data.type = type;
  if (price_token !== undefined) data.price_token = price_token;
  if (category_id !== undefined) data.category_id = category_id;
    
 
  try {
    const item = await itemService.getItemById(id);
    if (!item) {
      return res.status(404).json({ error: "Item not found" });
    }

    // 🔹 Permisos: seller solo puede editar sus productos
    if (req.user.role === "seller" && item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot edit another seller's product" });
    }

    const updatedItem = await itemService.updateItem(id, data);
    res.json({ message: "Item updated successfully", item: updatedItem });
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
    const item = await itemService.getItemById(id);
    if (!item){
    return res.status(404).json({ error: "Item not found" });
    } 
    
    // 🔹 Permisos: seller solo puede borrar sus productos
    if (req.user.role === "seller" && item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot delete another seller's product" });
    }

    await itemService.deleteItem(id);
    res.json({ message: "Item deleted successfully" });
  } catch (error) {
    console.error("Error deleting item:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

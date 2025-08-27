// BACK/controllers/inventoryController.js

import {
  createInventoryEntry,
  getAllInventory,
  getInventoryById,
  updateInventory,
  deleteInventory,
  checkLowStock,
} from "../services/inventoryService.js";

// Crear inventario (solo admin)
export const createInventory = async (req, res) => {
  try {
    const entry = await createInventoryEntry(req.body);
    res.status(201).json(entry);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Listar inventario (admin ve todos, seller solo los suyos)
export const listInventory = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === "seller") {
      where["$Item.seller_id$"] = req.user.id;
    }
    const inventory = await getAllInventory(where);
    res.json(inventory);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un inventario por id
export const getInventory = async (req, res) => {
  try {
    const inv = await getInventoryById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });

    // Seller solo puede ver sus productos
    if (req.user.role === "seller" && inv.Item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "Forbidden" });
    }

    res.json(inv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar inventario
export const updateInventoryController = async (req, res) => {
  try {
    const inv = await getInventoryById(req.params.id);
    if (!inv) return res.status(404).json({ error: "Not found" });

    if (req.user.role === "seller" && inv.Item.seller_id !== req.user.id) {
      return res.status(403).json({ error: "You cannot update another seller's inventory" });
    }

    const updated = await updateInventory(req.params.id, req.body);
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Eliminar inventario (solo admin)
export const deleteInventoryController = async (req, res) => {
  try {
    const result = await deleteInventory(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Alertas de bajo stock
export const lowStockAlert = async (req, res) => {
  try {
    const where = {};
    if (req.user.role === "seller") {
      where["$Item.seller_id$"] = req.user.id;
    }
    const alerts = await checkLowStock(where);
    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

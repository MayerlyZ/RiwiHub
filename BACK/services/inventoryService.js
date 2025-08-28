// BACK/services/inventoryService.js
// Lógica de inventario

import Inventory from "../models/inventory.js";
import Item from "../models/item.js";

export async function createInventoryEntry(data) {
  return Inventory.create(data);
}

export async function getAllInventory(where = {}) {
  return Inventory.findAll({ where, include: Item });
}

export async function getInventoryById(id) {
  return Inventory.findByPk(id, { include: Item });
}

export async function updateInventory(id, updates) {
  const inv = await Inventory.findByPk(id, { include: Item });
  if (!inv) throw new Error("Inventory not found");
  return inv.update(updates);
}

export async function deleteInventory(id) {
  const inv = await Inventory.findByPk(id, { include: Item });
  if (!inv) throw new Error("Inventory not found");
  await inv.destroy();
  return { message: "Inventory deleted" };
}

export async function checkLowStock(where = {}) {
  const inventory = await Inventory.findAll({ where, include: Item });
  return inventory.filter((i) => i.stock < i.min_stock);
}

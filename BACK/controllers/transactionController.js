import * as tokenService from "../services/tokenService.js";
import { isPositiveNumber, isInEnum, isNonEmptyString } from "../utils/validators.js";

// Obtener todas las transacciones
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await tokenService.getAllTransactions();
    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Obtener una transacción por ID
export const getTransactionById = async (req, res) => {
  const { id } = req.params;
  try {
    const transaction = await tokenService.getTransactionById(id);
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json(transaction);
  } catch (error) {
    console.error("Error fetching transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Crear una nueva transacción
export const createTransaction = async (req, res) => {
  const { user_id, amount, transaction_type, description, balance_after } = req.body;
  if (!isPositiveNumber(Number(user_id))) {
    return res.status(400).json({ error: "El user_id es requerido y debe ser un número positivo." });
  }
  if (!isPositiveNumber(Number(amount))) {
    return res.status(400).json({ error: "El amount debe ser un número positivo." });
  }
  if (!isInEnum(transaction_type, ["earn", "spend", "refund"])) {
    return res.status(400).json({ error: "El tipo de transacción no es válido." });
  }
  if (description !== undefined && description !== null && !isNonEmptyString(description)) {
    return res.status(400).json({ error: "La descripción debe ser un string válido o null." });
  }
  if (!isPositiveNumber(Number(balance_after))) {
    return res.status(400).json({ error: "El balance_after debe ser un número positivo." });
  }
  const data = {};
  if (user_id !== undefined) data.user_id = user_id;
  if (amount !== undefined) data.amount = amount;
  if (transaction_type !== undefined) data.transaction_type = transaction_type;
  if (description !== undefined) data.description = description;
  if (balance_after !== undefined) data.balance_after = balance_after;

  try {
    const newTransaction = await tokenService.createTransaction(data);
    res.status(201).json(newTransaction);
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Actualizar una transacción
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, transaction_type, description, balance_after } = req.body;
  if (amount !== undefined && !isPositiveNumber(Number(amount))) {
    return res.status(400).json({ error: "El amount debe ser un número positivo." });
  }
  if (transaction_type !== undefined && !isInEnum(transaction_type, ["earn", "spend", "refund"])) {
    return res.status(400).json({ error: "El tipo de transacción no es válido." });
  }
  if (description !== undefined && description !== null && !isNonEmptyString(description)) {
    return res.status(400).json({ error: "La descripción debe ser un string válido o null." });
  }
  if (balance_after !== undefined && !isPositiveNumber(Number(balance_after))) {
    return res.status(400).json({ error: "El balance_after debe ser un número positivo." });
  }

  const data = {};
  if (amount !== undefined) data.amount = amount;
  if (transaction_type !== undefined) data.transaction_type = transaction_type;
  if (description !== undefined) data.description = description;
  if (balance_after !== undefined) data.balance_after = balance_after;

  try {
    const updatedTransaction = await tokenService.updateTransaction(id, data);
    if (!updatedTransaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction updated successfully" });
  } catch (error) {
    console.error("Error updating transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Eliminar una transacción
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await tokenService.deleteTransaction(id);
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

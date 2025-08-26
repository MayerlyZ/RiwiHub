import TokenTransaction from "../models/TokenTransaction.js";
import { isPositiveNumber, isInEnum, isNonEmptyString } from "../utils/validators.js";

// Obtener todas las transacciones
export const getAllTransactions = async (req, res) => {
  try {
    const transactions = await TokenTransaction.findAll();
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
    const transaction = await TokenTransaction.findByPk(id);
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
  try {
    const newTransaction = await TokenTransaction.create({
      user_id,
      amount,
      transaction_type,
      description,
      balance_after,
    });
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
  try {
    const [updated] = await TokenTransaction.update(
      { amount, transaction_type, description, balance_after },
      { where: { transaction_id: id } }
    );
    if (!updated) {
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
    const deleted = await TokenTransaction.destroy({ where: { transaction_id: id } });
    if (!deleted) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    console.error("Error deleting transaction:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

import express from "express";
import {
  createTransaction,
  getTransactionById,
  getAllTransactions,
  updateTransaction,
  deleteTransaction
} from "../controllers/transactionController.js";

const router = express.Router();

// Create a new transaction
router.post("/", createTransaction);

// Get a transaction by ID
router.get("/:id", getTransactionById);

// Get all transactions
router.get("/", getAllTransactions);

// Update a transaction by ID
router.put("/:id", updateTransaction);

// Delete a transaction by ID
router.delete("/:id", deleteTransaction);

export default router;
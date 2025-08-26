import TransactionService from "../services/transactionService.js";

export const createTransaction = async (req, res) => {
  try {
    const transactionData = req.body;
    const newTransaction = await TransactionService.createTransaction(transactionData);
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ message: "Error creating transaction", error: error.message });
  }
};

export const getTransactionHistory = async (req, res) => {
  try {
    const userId = req.params.userId;
    const transactions = await TransactionService.getTransactionHistory(userId);
    res.status(200).json(transactions);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving transaction history", error: error.message });
  }
};

export const processPayment = async (req, res) => {
  try {
    const paymentData = req.body;
    const result = await TransactionService.processPayment(paymentData);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ message: "Error processing payment", error: error.message });
  }
};
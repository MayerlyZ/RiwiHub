import express from "express";
import { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction } from "../controllers/transactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import authorizeRoles from "../middlewares/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, authorizeRoles("admin"), getAllTransactions);
router.get("/:id", authMiddleware, authorizeRoles("buyer", "admin"), getTransactionById);
router.post("/", authMiddleware, authorizeRoles("buyer", "admin"), createTransaction);
router.put("/:id", authMiddleware, authorizeRoles("admin"), updateTransaction);
router.delete("/:id", authMiddleware, authorizeRoles("admin"), deleteTransaction);

export default router;

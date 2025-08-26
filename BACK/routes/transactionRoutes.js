import e from "express";
import { getAllTransactions, getTransactionById, createTransaction, updateTransaction, deleteTransaction} from "../controllers/transactionController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();
//
router.get("/", authMiddleware, getAllTransactions);
router.get("/:id", authMiddleware, getTransactionById);
router.post("/", authMiddleware, createTransaction);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);

export default router;

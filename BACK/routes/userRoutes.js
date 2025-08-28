import e from "express";
import {getAllUsers, getUserById, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import {registerUser, loginUser} from "../controllers/authController.js";
import authMiddleware from "../middlewares/authMiddleware.js";

const router = e.Router();

// Rutas públicas
router.post("/register", registerUser);
router.post("/login", loginUser);

// Rutas protegidas
router.get("/", authMiddleware, getAllUsers);
router.get("/:id", authMiddleware, getUserById);
router.post("/", authMiddleware, createUser);
router.put("/:id", authMiddleware, updateUser);
router.delete("/:id", authMiddleware, deleteUser);

export default router;

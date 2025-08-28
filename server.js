import express from "express";
import dotenv from "dotenv";
import sequelize from "./BACK/config/db.js";
import cors from "cors";

// Importar rutas
import userRoutes from "./BACK/routes/userRoutes.js";
import categoryRoutes from "./BACK/routes/categoryRoutes.js";
import cartRoutes from "./BACK/routes/cartRoutes.js";
import orderRoutes from "./BACK/routes/orderRoutes.js";
import transactionRoutes from "./BACK/routes/transactionRoutes.js";
import createAssociations from "./BACK/models/associations.js";
import accountingRoutes from "./BACK/routes/accountingRoutes.js";
import inventoryRoutes from "./BACK/routes/inventoryRoutes.js";


// Middlewares
import errorMiddleware from "./BACK/middlewares/errorMiddleware.js";
import authMiddleware from "./BACK/middlewares/authMiddleware.js";
import { Association } from "sequelize";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

// Crear asociaciones
createAssociations();

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/categories", authMiddleware, categoryRoutes);
app.use("/api/carts", authMiddleware, cartRoutes);
app.use("/api/orders", authMiddleware, orderRoutes);
app.use("/api/transactions", authMiddleware, transactionRoutes);
app.use("/api/inventory", authMiddleware, inventoryRoutes);
app.use("/api/accounting", authMiddleware, accountingRoutes);

// manejar errores 404
app.use((req, res, next) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Middleware de errores
app.use(errorMiddleware);

// Conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log("✅ Conectado a la base de datos"))
  .catch(err => console.error("❌ Error al conectar:", err));

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en puerto ${PORT}`);
});

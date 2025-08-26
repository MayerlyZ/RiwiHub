import express from "express";
import dotenv from "dotenv";
import sequelize from "./config/db.js";

// Importar rutas
import userRoutes from "./routes/userRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import transactionRoutes from "./routes/transactionRoutes.js";

// Middlewares
import errorMiddleware from "./middlewares/errorMiddleware.js";
import authMiddleware from "./middlewares/authMiddleware.js";

dotenv.config();
const app = express();

app.use(express.json());

// Rutas
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/carts", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/transactions", transactionRoutes);

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
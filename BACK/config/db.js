import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  logging: false, // Cambia a true si quieres ver las consultas SQL
});

// Importar asociaciones
import createAssociations from "../models/associations.js";
createAssociations();

export default sequelize;

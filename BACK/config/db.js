import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Configurar las variables de entorno según FreeDB.tech
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql",
  port: process.env.DB_PORT || 3306, 
  logging: false, 

  pool: {
    max: 5, 
    min: 0,
    acquire: 30000,
    idle: 10000
  }
});

// Verificar la conexión
(async () => {
  try {
    await sequelize.authenticate();
    console.log('Conexión a la base de datos establecida con éxito.');
  } catch (error) {
    console.error('No se pudo conectar a la base de datos:', error);
  }
})();

// Importar asociaciones
import createAssociations from "../models/associations.js";
createAssociations();

export default sequelize;
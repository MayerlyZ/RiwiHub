import { Sequelize } from "sequelize";

const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
  host: process.env.DB_HOST,
  dialect: "mysql", // or "postgres", "sqlite", "mssql"
  logging: false, // Set to true for SQL query logging
});

export default sequelize;
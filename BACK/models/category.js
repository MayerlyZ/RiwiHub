import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Category = sequelize.define("Category", {
  category_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  parent_id: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: "categories",
  timestamps: true,
});

export default Category;

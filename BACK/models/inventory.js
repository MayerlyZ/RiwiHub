import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Inventory = sequelize.define("Inventory", {
  inventory_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
  },
  min_stock: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 5,
  },
}, {
  tableName: "inventory",
  timestamps: true,
});

export default Inventory;

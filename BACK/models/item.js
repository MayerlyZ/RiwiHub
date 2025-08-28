import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Item = sequelize.define("Item", {
  item_id: {
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
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  price_token: {  
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: null,
  },
  stock: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
  },
  type: {
    type: DataTypes.ENUM("product", "service"),
    allowNull: false,
  },
  category_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  seller_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: "items",
  timestamps: true,
});

export default Item;

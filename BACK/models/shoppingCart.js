import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const ShoppingCart = sequelize.define("ShoppingCart", {
  cart_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM("active", "abandoned", "completed"),
    defaultValue: "active"
  }
}, {
  tableName: "shopping_carts",
  timestamps: true

});

export default ShoppingCart;

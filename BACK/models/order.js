import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const Order = sequelize.define("Order", {
  order_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  total_amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  status: {
    type: DataTypes.ENUM("pending", "paid", "shipped", "completed", "cancelled"),
    defaultValue: "pending",
  },
  payment_method: {
    type: DataTypes.ENUM("wallet", "credit_card", "cash"),
    allowNull: false,
  }
}, {
  tableName: "orders",
  timestamps: true,
});

export default Order;

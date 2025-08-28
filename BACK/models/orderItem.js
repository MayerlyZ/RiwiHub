import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const OrderItem = sequelize.define("OrderItem", {
  order_item_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  order_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
}, {
  tableName: "order_items",
  timestamps: true,
});

// hook
OrderItem.beforeSave((orderItem) => {
  orderItem.subtotal = orderItem.quantity * orderItem.unit_price;
});

export default OrderItem;

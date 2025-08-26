import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const CartItem = sequelize.define('CartItem', {
  cart_item_id: {
    type: DataTypes.INTEGER,
    autoIncrement: true,
    primaryKey: true,
  },
  cart_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'shopping_carts',
      key: 'cart_id',
    },
    onDelete: 'CASCADE',
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'items',
      key: 'item_id',
    },
  },
  quantity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
    },
  },
  unit_price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  subtotal: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
  },
  created_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updated_at: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
}, {
  tableName: 'cart_items',
  timestamps: false,
});

// Hook para calcular el subtotal antes de guardar.
CartItem.beforeSave((cartItem, options) => {
  cartItem.subtotal = cartItem.quantity * cartItem.unit_price;
});

export default CartItem;
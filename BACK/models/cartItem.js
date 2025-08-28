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
  },
  item_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
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
    get() {
      return this.getDataValue('subtotal');
    },
    set(value) {
      throw new Error("subtotal is a generated column and cannot be set manually.");
    }
  }
}, {
  tableName: 'cart_items',
  timestamps: true,
});

export default CartItem;

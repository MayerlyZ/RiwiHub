// models/TokenTransaction.js
import { DataTypes } from "sequelize";
import sequelize from "../config/db.js";

const TokenTransaction = sequelize.define("TokenTransaction", {
  transaction_id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  user_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  amount: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    validate: {
      min: 0.01, // cumple con el CHECK (amount > 0)
    },
  },
  transaction_type: {
    type: DataTypes.ENUM("earn", "spend", "refund"),
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING(255),
    allowNull: true,
  },
  balance_after: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0.00,
  }
}, {
  tableName: "token_transactions",
  timestamps: true,
  updatedAt: false
});

export default TokenTransaction;

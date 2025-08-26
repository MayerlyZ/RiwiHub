// models/User.js
import { DataTypes } from "sequelize";
import  sequelize  from "../config/db.js"; 

const User = sequelize.define(
  "User",
  {
    user_id: {  
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    name: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    wallet_balance: {
      type: DataTypes.DECIMAL(10, 2),
      defaultValue: 0,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "users",  
    timestamps: false,   
  }
);

export default User;

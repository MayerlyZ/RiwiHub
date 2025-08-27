// associations.js
import User from "./User.js";
import TokenTransaction from "./TokenTransaction.js";
import Category from "./category.js";
import Item from "./item.js";
import ShoppingCart from "./shoppingCart.js";
import CartItem from "./cartItem.js";
import Order from "./order.js";
import OrderItem from "./orderItem.js";
import Inventory from "./inventory.js"; 

export default function createAssociations() {
  // =========================
  // USERS
  // =========================
  User.hasMany(TokenTransaction, { foreignKey: "user_id", as: "transactions" });
  TokenTransaction.belongsTo(User, { foreignKey: "user_id", as: "user" });

  User.hasMany(ShoppingCart, { foreignKey: "user_id", as: "carts" });
  ShoppingCart.belongsTo(User, { foreignKey: "user_id", as: "user" });

  User.hasMany(Order, { foreignKey: "user_id", as: "orders" });
  Order.belongsTo(User, { foreignKey: "user_id", as: "user" });


  // =========================
  // SELLERS (User ↔ Item)
  // =========================
  User.hasMany(Item, { foreignKey: "seller_id", as: "items" });
  Item.belongsTo(User, { foreignKey: "seller_id", as: "seller" });

  // =========================
  // CATEGORIES
  // =========================
  Category.hasMany(Item, { foreignKey: "category_id", as: "items" });
  Item.belongsTo(Category, { foreignKey: "category_id", as: "category" });

  // Para categorías jerárquicas (padre-hijo)
  Category.hasMany(Category, { foreignKey: "parent_id", as: "subcategories" });
  Category.belongsTo(Category, { foreignKey: "parent_id", as: "parentCategory" });

  // =========================
  // ITEMS
  // =========================
  Item.hasMany(CartItem, { foreignKey: "item_id", as: "cartItems" });
  CartItem.belongsTo(Item, { foreignKey: "item_id", as: "item" });

  Item.hasMany(OrderItem, { foreignKey: "item_id", as: "orderItems" });
  OrderItem.belongsTo(Item, { foreignKey: "item_id", as: "item" });

  Item.hasOne(Inventory, { foreignKey: "item_id", as: "inventory" });
  Inventory.belongsTo(Item, { foreignKey: "item_id", as: "item" });


  // =========================
  // SHOPPING CART
  // =========================
  ShoppingCart.hasMany(CartItem, { foreignKey: "cart_id", as: "cartItems" });
  CartItem.belongsTo(ShoppingCart, { foreignKey: "cart_id", as: "cart" });

  // =========================
  // ORDERS
  // =========================
  Order.hasMany(OrderItem, { foreignKey: "order_id", as: "orderItems" });
  OrderItem.belongsTo(Order, { foreignKey: "order_id", as: "order" });
}

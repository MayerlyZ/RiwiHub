import User from "../models/User.js";

// Get all users
export const getAllUsers = async () => {
    return await User.findAll();
};

// Get user by ID
export const getUserById = async (id) => {
  return await User.findByPk(id);
};

// Delete a user
export const deleteUser = async (id) => {
  return await User.destroy({ where: { user_id: id } });
};

// Create user
export const createUser = async({name, email, password,wallet_balance, role}) => {
    return await User.create({ name, email, password, wallet_balance, role });
};

// update user
export const updateUser = async (id, data) => {
  const [updatedUser] = await User.update(data, { where: { user_id: id } });
  if (!updatedUser) return null;
  return await User.findByPk(id);
};
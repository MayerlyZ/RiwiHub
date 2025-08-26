import User from "../models/User.js";
import { validatePassword, generateAuthToken } from "../utils/auth.js";
import { isNonEmptyString, isValidEmail, isPositiveNumber } from "../utils/validators.js";

// Get all users
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Create a new user
export const createUser = async (req, res) => {
  const { name, email, password, wallet_balance, role } = req.body;
  // Validaciones
  if (!isNonEmptyString(name)) {
    return res.status(400).json({ error: "El nombre es requerido y debe ser un string válido." });
  }
  if (!isValidEmail(email)) {
    return res.status(400).json({ error: "El email no es válido." });
  }
  if (!isNonEmptyString(password)) {
    return res.status(400).json({ error: "La contraseña es requerida." });
  }
  if (wallet_balance !== undefined && !isPositiveNumber(Number(wallet_balance))) {
    return res.status(400).json({ error: "El saldo debe ser un número positivo." });
  }
  try {
    const newUser = await User.create({
      name,
      email,
      password,
      wallet_balance,
      role, // Si no se envía, Sequelize usará el valor por defecto
    });
    res.status(201).json(newUser);
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update a user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, password, wallet_balance, role } = req.body;
  // Validaciones (solo si los campos vienen en el body)
  if (name !== undefined && !isNonEmptyString(name)) {
    return res.status(400).json({ error: "El nombre debe ser un string válido." });
  }
  if (email !== undefined && !isValidEmail(email)) {
    return res.status(400).json({ error: "El email no es válido." });
  }
  if (password !== undefined && !isNonEmptyString(password)) {
    return res.status(400).json({ error: "La contraseña debe ser un string válido." });
  }
  if (wallet_balance !== undefined && !isPositiveNumber(Number(wallet_balance))) {
    return res.status(400).json({ error: "El saldo debe ser un número positivo." });
  }
  try {
    const [updated] = await User.update(
      { name, email, password, wallet_balance, role },
      { where: { user_id: id } }
    );
    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const deleted = await User.destroy({ where: { id } });
    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ where: { email } });
    if (!user || !(await validatePassword(password, user.password))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    const token = generateAuthToken(user);
    res.json({ token });
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const newUser = await User.create({ name, email, password });
    const token = newUser.generateAuthToken();
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

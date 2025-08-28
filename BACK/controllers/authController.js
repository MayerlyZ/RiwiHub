import * as authService from '../services/authService.js';
import { generateAuthToken } from '../utils/auth.js';

// Login user
export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await authService.loginUser(email, password);
    if (!result) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json(result);
  } catch (error) {
    console.error("Error logging in user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register user
export const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const existingUser = await authService.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "Email already in use" });
    }
    const newUser = await authService.registerUser({ name, email, password, wallet_balance: 0, role: "buyer" });
    const token = generateAuthToken(newUser);
    res.status(201).json({ token });
  } catch (error) {
    console.error("Error registering user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

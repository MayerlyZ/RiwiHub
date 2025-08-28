import User from '../models/User.js';
import { hashPassword, validatePassword, generateAuthToken } from '../utils/auth.js';

export const registerUser = async ({ name, email, password, wallet_balance, role }) => {
  const hashedPassword = await hashPassword(password);
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    wallet_balance,
    role
  });
  return user;
};

export const loginUser = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) return null;
  const isValid = await validatePassword(password, user.password);
  if (!isValid) return null;
  const token = generateAuthToken(user);
  return { user, token };
};

export const getUserByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

// hook para hashear la contraseña
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
};

// Metodo para comparar contraseñas
export const validatePassword = async (password, hashedPassword) => {
  return bcrypt.compare(password, hashedPassword);
};

// metodo para generar un token JWT
export const generateAuthToken = (user) => {
  const payload = { id: user.user_id, role: user.role };
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" });
};

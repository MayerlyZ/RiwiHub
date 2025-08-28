import JWT from "jsonwebtoken";

export default function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token provided" });
  }

  const token = authHeader.split(" ")[1];
  try {
    const decoded = JWT.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Attach user info to request object
    next();
  } catch (error) {
    return res.status(401).json({ error: "Invalid token" });
  }
}
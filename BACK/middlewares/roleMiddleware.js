// BACK/middlewares/roleMiddleware.js

export default function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    // req.user debe estar definido por authMiddleware
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: "No tienes permisos para acceder a este recurso" });
    }
    next();
  };
}

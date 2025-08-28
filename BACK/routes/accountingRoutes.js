// BACK/routes/accountingRoutes.js
// Purpose: wire accounting endpoints
// Nota: proteger con auth si corresponde a admins, reutilizando tu middleware

import e from "express";
import { getDailyReport } from "../controllers/accountingController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import  authorizeRoles  from "../middlewares/roleMiddleware.js";

const router = e.Router();

// -- Restringe a usuarios autenticados (y opcionalmente revisa rol admin dentro del middleware)
router.get("/daily", authMiddleware, authorizeRoles("admin","seller"), getDailyReport);

export default router;

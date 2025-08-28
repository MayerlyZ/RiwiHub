import express from "express";
import authMiddleware from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";
import {
  revenueReport,
  topServicesReport,
  revenueByTypeReport,
} from "../controllers/reportController.js";

const router = express.Router();

// Solo admin puede ver reportes
router.use(authMiddleware, authorizeRoles("admin"));

router.get("/revenue", revenueReport);
router.get("/top-services", topServicesReport);
router.get("/revenue-by-type", revenueByTypeReport);

export default router;

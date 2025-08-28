// BACK/controllers/accountingController.js
// Purpose: expose HTTP handler(s) for accounting


import { computeDailyReport } from "../services/accountingService.js";

/**
 * GET /api/accounting/daily?date=YYYY-MM-DD
 * If no date is provided, uses "today" in America/Bogota.
 */
export async function getDailyReport(req, res) {
  try {
    // -- Si no llega 'date', usamos la fecha de hoy en Bogotá
    const tzOffset = -5; // Bogotá UTC-5 sin DST
    const now = new Date();
    // Convertimos "hoy" a YYYY-MM-DD en Bogotá
    const bogotaNow = new Date(now.getTime() + (tzOffset * 60 - now.getTimezoneOffset()) * 60000);
    const todayISO = bogotaNow.toISOString().slice(0, 10);

    const dateISO = (req.query.date && typeof req.query.date === "string") ? req.query.date : todayISO;

    const report = await computeDailyReport(dateISO);
    return res.json(report);
  } catch (err) {
    console.error("Error computing daily report:", err);
    return res.status(400).json({ error: err.message || "Unable to compute daily report." });
  }
}

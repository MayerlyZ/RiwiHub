// BACK/services/accountingService.js
// Purpose: compute daily sales summary based on orders in a given local day


import { Op } from "sequelize";
import Order from "../models/order.js";

/**
 * Compute a daily report for a given local date (America/Bogota).
 * @param {string} dateISO - Expected format 'YYYY-MM-DD'
 * @returns {Promise<object>} - JSON-safe summary
 */
export async function computeDailyReport(dateISO) {
  // -- Validación mínima de entrada
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dateISO)) {
    throw new Error("Invalid date format. Use YYYY-MM-DD.");
  }

  // -- Bogotá no maneja DST; offset fijo -05:00. Armamos el rango local del día
  const start = new Date(`${dateISO}T00:00:00.000-05:00`);
  const end = new Date(`${dateISO}T23:59:59.999-05:00`);

  // -- Filtro base por fecha de creación (createdAt) dentro del día local
  const where = {
    createdAt: { [Op.between]: [start, end] },
    // Si tu tabla de órdenes tuviera un estado (p.ej. "status" o "order_status"),
    // podrías filtrar aquí solo "paid"/"completed".
    // status: { [Op.in]: ["paid", "completed"] }
  };

  // -- Traemos solo lo necesario para sumar
  const orders = await Order.findAll({
    where,
    attributes: ["total_amount", "payment_method"], // evita traer columnas extra
    raw: true,
  });

  // -- Cálculo de KPIs básicos
  let grossRevenue = 0;
  const byPaymentMethod = { wallet: 0, credit_card: 0, cash: 0 };

  for (const o of orders) {
    // Aseguramos número en JS
    const amt = Number(o.total_amount);
    grossRevenue += isNaN(amt) ? 0 : amt;

    // Suma por método de pago si está dentro de los tres definidos en el modelo
    if (o.payment_method && byPaymentMethod.hasOwnProperty(o.payment_method)) {
      byPaymentMethod[o.payment_method] += isNaN(amt) ? 0 : amt;
    }
  }

  const ordersCount = orders.length;
  const averageTicket = ordersCount > 0 ? +(grossRevenue / ordersCount).toFixed(2) : 0;

  // -- Respuesta JSON 
  return {
    date: dateISO,
    timezone: "America/Bogota",
    orders_count: ordersCount,
    gross_revenue: +grossRevenue.toFixed(2),
    average_ticket: averageTicket,
    by_payment_method: {
      wallet: +byPaymentMethod.wallet.toFixed(2),
      credit_card: +byPaymentMethod.credit_card.toFixed(2),
      cash: +byPaymentMethod.cash.toFixed(2),
    },
  };
}

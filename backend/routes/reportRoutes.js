const express = require("express");
const router = express.Router();
const invoiceController = require("../controllers/invoiceController");
const { all, get } = require("../db");

router.get("/summary", invoiceController.getSummaryReport);

// Dashboard stats endpoint - all values computed dynamically from DB
router.get("/dashboard", async (req, res, next) => {
  try {
    const inProgress = await get(
      "SELECT COUNT(*) as count FROM services WHERE status = 'in_progress'",
    );
    const pending = await get(
      "SELECT COUNT(*) as count FROM services WHERE status = 'pending'",
    );
    const completed = await get(
      "SELECT COUNT(*) as count FROM services WHERE status = 'completed'",
    );
    const delivered = await get(
      "SELECT COUNT(*) as count FROM services WHERE status = 'delivered'",
    );
    const totalCustomers = await get("SELECT COUNT(*) as count FROM customers");

    // Today's revenue (paid invoices created today)
    const todayRevenue = await get(
      "SELECT SUM(final_amount) as total FROM invoices WHERE payment_status = 'paid' AND date(created_at) = date('now', 'localtime')",
    );

    // Completed this month (services with end_date in current month)
    const completedThisMonth = await get(
      "SELECT COUNT(*) as count FROM services WHERE status IN ('completed','delivered') AND strftime('%Y-%m', end_date) = strftime('%Y-%m', 'now', 'localtime')",
    );

    // Monthly revenue for last 6 months (paid invoices)
    const monthly = await all(
      `SELECT strftime('%Y-%m', created_at) as ym, SUM(final_amount) as total
       FROM invoices WHERE payment_status = 'paid'
         AND created_at >= date('now', 'localtime', '-5 months', 'start of month')
       GROUP BY ym ORDER BY ym`,
    );

    // Recent repairs
    const recentRepairs = await all(
      `SELECT s.id, s.status, s.start_date, s.end_date,
              cust.full_name as customer_name,
              c.plate_number
       FROM services s
       LEFT JOIN cars c ON s.car_id = c.id
       LEFT JOIN customers cust ON s.customer_id = cust.id
       ORDER BY s.id DESC LIMIT 10`,
    );

    return res.status(200).json({
      success: true,
      stats: {
        inProgress: inProgress.count,
        pending: pending.count,
        completed: completed.count,
        delivered: delivered.count,
        totalCustomers: totalCustomers.count,
        todayRevenue: todayRevenue.total || 0,
        completedThisMonth: completedThisMonth.count,
        monthlyRevenue: monthly.map((m) => ({ month: m.ym, value: m.total || 0 })),
        recentRepairs,
      },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;

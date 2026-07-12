const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const {
  protect,
  authorize,
} = require("../middlewares/authMiddleware");

// Dashboard Route
router.get(
  "/",
  protect,
  authorize("admin", "fleet_manager"),
  getDashboardStats
);

module.exports = router;
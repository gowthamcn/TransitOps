const express = require("express");

const router = express.Router();

const {
  getDashboardStats,
} = require("../controllers/dashboardController");

const {
  protect,
} = require("../middlewares/authMiddleware");

// Dashboard Route
router.get("/", protect, getDashboardStats);

module.exports = router;
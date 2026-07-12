const dashboardService = require("../services/dashboardService");

const getDashboardStats = async (req, res) => {
  try {
    const stats = await dashboardService.getDashboardStats(req.query);

    return res.status(200).json({
      success: true,
      message: "Dashboard data fetched successfully",
      data: stats,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
};
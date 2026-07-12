const driverService = require('../services/driverService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Create a new driver
 * @route POST /api/drivers
 * @access Private
 */
const createDriver = async (req, res) => {
  try {
    const driver = await driverService.createDriver(req.body);
    return successResponse(res, 'Driver created successfully', driver, 201);
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return errorResponse(res, `Driver with this ${field} already exists`, 400);
    }
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Get all drivers with pagination
 * @route GET /api/drivers
 * @access Private
 */
const getDrivers = async (req, res) => {
  try {
    const { page, limit, status, licenseType, search, sortBy, sortOrder } = req.query;
    
    const result = await driverService.getAllDrivers({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      licenseType,
      search,
      sortBy,
      sortOrder,
    });
    
    return successResponse(res, 'Drivers retrieved successfully', result);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get driver by ID
 * @route GET /api/drivers/:id
 * @access Private
 */
const getDriverById = async (req, res) => {
  try {
    const driver = await driverService.getDriverById(req.params.id);
    return successResponse(res, 'Driver retrieved successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

/**
 * Update driver
 * @route PUT /api/drivers/:id
 * @access Private
 */
const updateDriver = async (req, res) => {
  try {
    const driver = await driverService.updateDriver(req.params.id, req.body);
    return successResponse(res, 'Driver updated successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Delete driver
 * @route DELETE /api/drivers/:id
 * @access Private
 */
const deleteDriver = async (req, res) => {
  try {
    const driver = await driverService.deleteDriver(req.params.id);
    return successResponse(res, 'Driver deleted successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

/**
 * Assign vehicle to driver
 * @route PUT /api/drivers/:id/assign-vehicle
 * @access Private
 */
const assignVehicle = async (req, res) => {
  try {
    const { vehicleId } = req.body;
    if (!vehicleId) {
      return errorResponse(res, 'Vehicle ID is required', 400);
    }
    
    const driver = await driverService.assignVehicle(req.params.id, vehicleId);
    return successResponse(res, 'Vehicle assigned successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Unassign vehicle from driver
 * @route PUT /api/drivers/:id/unassign-vehicle
 * @access Private
 */
const unassignVehicle = async (req, res) => {
  try {
    const driver = await driverService.unassignVehicle(req.params.id);
    return successResponse(res, 'Vehicle unassigned successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Update driver status
 * @route PUT /api/drivers/:id/status
 * @access Private
 */
const updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) {
      return errorResponse(res, 'Status is required', 400);
    }
    
    const driver = await driverService.updateStatus(req.params.id, status);
    return successResponse(res, 'Driver status updated successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Get available drivers
 * @route GET /api/drivers/available
 * @access Private
 */
const getAvailableDrivers = async (req, res) => {
  try {
    const drivers = await driverService.getAvailableDrivers();
    return successResponse(res, 'Available drivers retrieved successfully', drivers);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get driver statistics
 * @route GET /api/drivers/stats
 * @access Private
 */
const getDriverStats = async (req, res) => {
  try {
    const stats = await driverService.getDriverStats();
    return successResponse(res, 'Driver statistics retrieved successfully', stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Search drivers
 * @route GET /api/drivers/search
 * @access Private
 */
const searchDrivers = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return errorResponse(res, 'Search term is required', 400);
    }
    
    const drivers = await driverService.searchDrivers(q);
    return successResponse(res, 'Search results retrieved successfully', drivers);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get drivers by status
 * @route GET /api/drivers/status/:status
 * @access Private
 */
const getDriversByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const drivers = await driverService.getDriversByStatus(status);
    return successResponse(res, 'Drivers retrieved successfully', drivers);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get drivers with expired licenses
 * @route GET /api/drivers/expired-licenses
 * @access Private
 */
const getDriversWithExpiredLicenses = async (req, res) => {
  try {
    const drivers = await driverService.getDriversWithExpiredLicenses();
    return successResponse(res, 'Drivers with expired licenses retrieved successfully', drivers);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get drivers with expiring licenses
 * @route GET /api/drivers/expiring-licenses
 * @access Private
 */
const getDriversWithExpiringLicenses = async (req, res) => {
  try {
    const { days = 30 } = req.query;
    const drivers = await driverService.getDriversWithExpiringLicenses(parseInt(days));
    return successResponse(res, 'Drivers with expiring licenses retrieved successfully', drivers);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Add document to driver
 * @route POST /api/drivers/:id/documents
 * @access Private
 */
const addDocument = async (req, res) => {
  try {
    const driver = await driverService.addDocument(req.params.id, req.body);
    return successResponse(res, 'Document added successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Remove document from driver
 * @route DELETE /api/drivers/:id/documents/:documentId
 * @access Private
 */
const removeDocument = async (req, res) => {
  try {
    const driver = await driverService.removeDocument(
      req.params.id,
      req.params.documentId
    );
    return successResponse(res, 'Document removed successfully', driver);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

module.exports = {
  createDriver,
  getDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignVehicle,
  unassignVehicle,
  updateStatus,
  getAvailableDrivers,
  getDriverStats,
  searchDrivers,
  getDriversByStatus,
  getDriversWithExpiredLicenses,
  getDriversWithExpiringLicenses,
  addDocument,
  removeDocument,
};

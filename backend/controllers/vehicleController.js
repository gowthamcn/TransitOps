const vehicleService = require('../services/vehicleService');
const { successResponse, errorResponse } = require('../utils/responseHandler');

/**
 * Create a new vehicle
 * @route POST /api/vehicles
 * @access Private
 */
const createVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.createVehicle(req.body);
    return successResponse(res, 'Vehicle created successfully', vehicle, 201);
  } catch (error) {
    if (error.code === 11000) {
      return errorResponse(res, 'Vehicle with this registration number already exists', 400);
    }
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Get all vehicles with pagination
 * @route GET /api/vehicles
 * @access Private
 */
const getVehicles = async (req, res) => {
  try {
    const { page, limit, status, vehicleType, search, sortBy, sortOrder } = req.query;
    
    const result = await vehicleService.getAllVehicles({
      page: parseInt(page) || 1,
      limit: parseInt(limit) || 10,
      status,
      vehicleType,
      search,
      sortBy,
      sortOrder,
    });
    
    return successResponse(res, 'Vehicles retrieved successfully', result);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get vehicle by ID
 * @route GET /api/vehicles/:id
 * @access Private
 */
const getVehicleById = async (req, res) => {
  try {
    const vehicle = await vehicleService.getVehicleById(req.params.id);
    return successResponse(res, 'Vehicle retrieved successfully', vehicle);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

/**
 * Update vehicle
 * @route PUT /api/vehicles/:id
 * @access Private
 */
const updateVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.updateVehicle(req.params.id, req.body);
    return successResponse(res, 'Vehicle updated successfully', vehicle);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Delete vehicle
 * @route DELETE /api/vehicles/:id
 * @access Private
 */
const deleteVehicle = async (req, res) => {
  try {
    const vehicle = await vehicleService.deleteVehicle(req.params.id);
    return successResponse(res, 'Vehicle deleted successfully', vehicle);
  } catch (error) {
    return errorResponse(res, error.message, 404);
  }
};

/**
 * Assign driver to vehicle
 * @route PUT /api/vehicles/:id/assign-driver
 * @access Private
 */
const assignDriver = async (req, res) => {
  try {
    const { driverId } = req.body;
    if (!driverId) {
      return errorResponse(res, 'Driver ID is required', 400);
    }
    
    const vehicle = await vehicleService.assignDriver(req.params.id, driverId);
    return successResponse(res, 'Driver assigned successfully', vehicle);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Unassign driver from vehicle
 * @route PUT /api/vehicles/:id/unassign-driver
 * @access Private
 */
const unassignDriver = async (req, res) => {
  try {
    const vehicle = await vehicleService.unassignDriver(req.params.id);
    return successResponse(res, 'Driver unassigned successfully', vehicle);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Update vehicle mileage
 * @route PUT /api/vehicles/:id/mileage
 * @access Private
 */
const updateMileage = async (req, res) => {
  try {
    const { mileage } = req.body;
    if (mileage === undefined || mileage < 0) {
      return errorResponse(res, 'Valid mileage is required', 400);
    }
    
    const vehicle = await vehicleService.updateMileage(req.params.id, mileage);
    return successResponse(res, 'Mileage updated successfully', vehicle);
  } catch (error) {
    return errorResponse(res, error.message, 400);
  }
};

/**
 * Get available vehicles
 * @route GET /api/vehicles/available
 * @access Private
 */
const getAvailableVehicles = async (req, res) => {
  try {
    const vehicles = await vehicleService.getAvailableVehicles();
    return successResponse(res, 'Available vehicles retrieved successfully', vehicles);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get vehicle statistics
 * @route GET /api/vehicles/stats
 * @access Private
 */
const getVehicleStats = async (req, res) => {
  try {
    const stats = await vehicleService.getVehicleStats();
    return successResponse(res, 'Vehicle statistics retrieved successfully', stats);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Search vehicles
 * @route GET /api/vehicles/search
 * @access Private
 */
const searchVehicles = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) {
      return errorResponse(res, 'Search term is required', 400);
    }
    
    const vehicles = await vehicleService.searchVehicles(q);
    return successResponse(res, 'Search results retrieved successfully', vehicles);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

/**
 * Get vehicles by status
 * @route GET /api/vehicles/status/:status
 * @access Private
 */
const getVehiclesByStatus = async (req, res) => {
  try {
    const { status } = req.params;
    const vehicles = await vehicleService.getVehiclesByStatus(status);
    return successResponse(res, 'Vehicles retrieved successfully', vehicles);
  } catch (error) {
    return errorResponse(res, error.message, 500);
  }
};

module.exports = {
  createVehicle,
  getVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  assignDriver,
  unassignDriver,
  updateMileage,
  getAvailableVehicles,
  getVehicleStats,
  searchVehicles,
  getVehiclesByStatus,
};

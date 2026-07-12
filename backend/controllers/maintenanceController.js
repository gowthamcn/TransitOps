const maintenanceService = require('../services/maintenanceService');

/**
 * @route   POST /api/maintenance
 * @desc    Create a maintenance record (status: Open, vehicle -> In Shop)
 */
const createMaintenance = async (req, res, next) => {
  try {
    const record = await maintenanceService.createMaintenance(req.body);
    res.status(201).json({
      success: true,
      message: 'Maintenance record created successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/maintenance
 * @desc    Get all maintenance records (supports ?status=&vehicle=&page=&limit=)
 */
const getAllMaintenance = async (req, res, next) => {
  try {
    const result = await maintenanceService.getAllMaintenance(req.query);
    res.status(200).json({
      success: true,
      message: 'Maintenance records fetched successfully',
      data: result.records,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/maintenance/:id
 * @desc    Get a single maintenance record by ID
 */
const getMaintenanceById = async (req, res, next) => {
  try {
    const record = await maintenanceService.getMaintenanceById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Maintenance record fetched successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/maintenance/:id
 * @desc    Update an Open maintenance record
 */
const updateMaintenance = async (req, res, next) => {
  try {
    const record = await maintenanceService.updateMaintenance(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Maintenance record updated successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/maintenance/:id
 * @desc    Delete an Open maintenance record
 */
const deleteMaintenance = async (req, res, next) => {
  try {
    const result = await maintenanceService.deleteMaintenance(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/maintenance/:id/close
 * @desc    Close an Open maintenance record (vehicle -> Available unless Retired)
 */
const closeMaintenance = async (req, res, next) => {
  try {
    const record = await maintenanceService.closeMaintenance(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Maintenance record closed successfully',
      data: record,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  closeMaintenance,
};
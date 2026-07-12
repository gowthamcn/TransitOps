const Vehicle = require('../models/Vehicle');
const Driver = require('../models/Driver');

/**
 * Create a new vehicle
 * @param {Object} vehicleData - Vehicle data
 * @returns {Promise<Object>} Created vehicle
 */
const createVehicle = async (vehicleData) => {
  const vehicle = new Vehicle(vehicleData);
  return await vehicle.save();
};

/**
 * Get all vehicles with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Vehicles with pagination info
 */
const getAllVehicles = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    vehicleType,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const query = { isActive: true };

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by vehicle type
  if (vehicleType) {
    query.vehicleType = vehicleType;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { registrationNumber: { $regex: search, $options: 'i' } },
      { make: { $regex: search, $options: 'i' } },
      { model: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [vehicles, total] = await Promise.all([
    Vehicle.find(query)
      .populate('assignedDriver', 'firstName lastName employeeId')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Vehicle.countDocuments(query),
  ]);

  return {
    vehicles,
    pagination: {
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      totalItems: total,
      itemsPerPage: limit,
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1,
    },
  };
};

/**
 * Get vehicle by ID
 * @param {String} vehicleId - Vehicle ID
 * @returns {Promise<Object>} Vehicle object
 */
const getVehicleById = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId).populate(
    'assignedDriver',
    'firstName lastName employeeId phone email'
  );
  
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }
  
  return vehicle;
};

/**
 * Update vehicle
 * @param {String} vehicleId - Vehicle ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated vehicle
 */
const updateVehicle = async (vehicleId, updateData) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    vehicleId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('assignedDriver', 'firstName lastName employeeId');

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  return vehicle;
};

/**
 * Delete vehicle (soft delete)
 * @param {String} vehicleId - Vehicle ID
 * @returns {Promise<Object>} Deleted vehicle
 */
const deleteVehicle = async (vehicleId) => {
  const vehicle = await Vehicle.findByIdAndUpdate(
    vehicleId,
    { $set: { isActive: false } },
    { new: true }
  );

  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // If vehicle had an assigned driver, unassign it
  if (vehicle.assignedDriver) {
    await Driver.findByIdAndUpdate(vehicle.assignedDriver, {
      $set: { assignedVehicle: null },
    });
  }

  return vehicle;
};

/**
 * Assign driver to vehicle
 * @param {String} vehicleId - Vehicle ID
 * @param {String} driverId - Driver ID
 * @returns {Promise<Object>} Updated vehicle
 */
const assignDriver = async (vehicleId, driverId) => {
  // Check if vehicle exists
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  // Check if driver exists and is active
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }

  if (driver.status !== 'active') {
    throw new Error('Cannot assign inactive driver to vehicle');
  }

  // If driver is already assigned to another vehicle, unassign
  if (driver.assignedVehicle && driver.assignedVehicle.toString() !== vehicleId) {
    await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
      $set: { assignedDriver: null },
    });
  }

  // If vehicle already has a driver, unassign that driver
  if (vehicle.assignedDriver && vehicle.assignedDriver.toString() !== driverId) {
    await Driver.findByIdAndUpdate(vehicle.assignedDriver, {
      $set: { assignedVehicle: null },
    });
  }

  // Assign driver to vehicle
  vehicle.assignedDriver = driverId;
  await vehicle.save();

  // Assign vehicle to driver
  driver.assignedVehicle = vehicleId;
  await driver.save();

  return await Vehicle.findById(vehicleId).populate(
    'assignedDriver',
    'firstName lastName employeeId phone email'
  );
};

/**
 * Unassign driver from vehicle
 * @param {String} vehicleId - Vehicle ID
 * @returns {Promise<Object>} Updated vehicle
 */
const unassignDriver = async (vehicleId) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  if (vehicle.assignedDriver) {
    await Driver.findByIdAndUpdate(vehicle.assignedDriver, {
      $set: { assignedVehicle: null },
    });
    vehicle.assignedDriver = null;
    await vehicle.save();
  }

  return await Vehicle.findById(vehicleId);
};

/**
 * Update vehicle mileage
 * @param {String} vehicleId - Vehicle ID
 * @param {Number} mileage - New mileage
 * @returns {Promise<Object>} Updated vehicle
 */
const updateMileage = async (vehicleId, mileage) => {
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  if (mileage < vehicle.currentMileage) {
    throw new Error('New mileage cannot be less than current mileage');
  }

  vehicle.currentMileage = mileage;
  await vehicle.save();

  return vehicle;
};

/**
 * Get vehicles by status
 * @param {String} status - Vehicle status
 * @returns {Promise<Array>} List of vehicles
 */
const getVehiclesByStatus = async (status) => {
  return await Vehicle.find({ status, isActive: true }).populate(
    'assignedDriver',
    'firstName lastName employeeId'
  );
};

/**
 * Get available vehicles (active and not assigned)
 * @returns {Promise<Array>} List of available vehicles
 */
const getAvailableVehicles = async () => {
  return await Vehicle.find({
    status: 'active',
    isActive: true,
    assignedDriver: null,
  });
};

/**
 * Get vehicle statistics
 * @returns {Promise<Object>} Vehicle statistics
 */
const getVehicleStats = async () => {
  const stats = await Vehicle.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        maintenance: { $sum: { $cond: [{ $eq: ['$status', 'maintenance'] }, 1, 0] } },
        inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
        retired: { $sum: { $cond: [{ $eq: ['$status', 'retired'] }, 1, 0] } },
        assigned: { $sum: { $cond: [{ $ne: ['$assignedDriver', null] }, 1, 0] } },
        unassigned: { $sum: { $cond: [{ $eq: ['$assignedDriver', null] }, 1, 0] } },
      },
    },
  ]);

  // Get vehicle type distribution
  const typeDistribution = await Vehicle.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$vehicleType',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get fuel type distribution
  const fuelDistribution = await Vehicle.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$fuelType',
        count: { $sum: 1 },
      },
    },
  ]);

  return {
    overview: stats[0] || {
      total: 0,
      active: 0,
      maintenance: 0,
      inactive: 0,
      retired: 0,
      assigned: 0,
      unassigned: 0,
    },
    typeDistribution,
    fuelDistribution,
  };
};

/**
 * Search vehicles
 * @param {String} searchTerm - Search term
 * @returns {Promise<Array>} Matching vehicles
 */
const searchVehicles = async (searchTerm) => {
  return await Vehicle.find({
    isActive: true,
    $or: [
      { registrationNumber: { $regex: searchTerm, $options: 'i' } },
      { make: { $regex: searchTerm, $options: 'i' } },
      { model: { $regex: searchTerm, $options: 'i' } },
    ],
  }).populate('assignedDriver', 'firstName lastName employeeId');
};

module.exports = {
  createVehicle,
  getAllVehicles,
  getVehicleById,
  updateVehicle,
  deleteVehicle,
  assignDriver,
  unassignDriver,
  updateMileage,
  getVehiclesByStatus,
  getAvailableVehicles,
  getVehicleStats,
  searchVehicles,
};

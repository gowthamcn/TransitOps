const Driver = require('../models/Driver');
const Vehicle = require('../models/Vehicle');

/**
 * Create a new driver
 * @param {Object} driverData - Driver data
 * @returns {Promise<Object>} Created driver
 */
const createDriver = async (driverData) => {
  const driver = new Driver(driverData);
  return await driver.save();
};

/**
 * Get all drivers with pagination and filtering
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Drivers with pagination info
 */
const getAllDrivers = async (options = {}) => {
  const {
    page = 1,
    limit = 10,
    status,
    licenseType,
    search,
    sortBy = 'createdAt',
    sortOrder = 'desc',
  } = options;

  const query = { isActive: true };

  // Filter by status
  if (status) {
    query.status = status;
  }

  // Filter by license type
  if (licenseType) {
    query.licenseType = licenseType;
  }

  // Search functionality
  if (search) {
    query.$or = [
      { employeeId: { $regex: search, $options: 'i' } },
      { firstName: { $regex: search, $options: 'i' } },
      { lastName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { licenseNumber: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const sort = { [sortBy]: sortOrder === 'desc' ? -1 : 1 };

  const [drivers, total] = await Promise.all([
    Driver.find(query)
      .populate('assignedVehicle', 'registrationNumber make model vehicleType')
      .sort(sort)
      .skip(skip)
      .limit(limit),
    Driver.countDocuments(query),
  ]);

  return {
    drivers,
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
 * Get driver by ID
 * @param {String} driverId - Driver ID
 * @returns {Promise<Object>} Driver object
 */
const getDriverById = async (driverId) => {
  const driver = await Driver.findById(driverId).populate(
    'assignedVehicle',
    'registrationNumber make model vehicleType status'
  );

  if (!driver) {
    throw new Error('Driver not found');
  }

  return driver;
};

/**
 * Update driver
 * @param {String} driverId - Driver ID
 * @param {Object} updateData - Update data
 * @returns {Promise<Object>} Updated driver
 */
const updateDriver = async (driverId, updateData) => {
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('assignedVehicle', 'registrationNumber make model vehicleType');

  if (!driver) {
    throw new Error('Driver not found');
  }

  return driver;
};

/**
 * Delete driver (soft delete)
 * @param {String} driverId - Driver ID
 * @returns {Promise<Object>} Deleted driver
 */
const deleteDriver = async (driverId) => {
  const driver = await Driver.findByIdAndUpdate(
    driverId,
    { $set: { isActive: false } },
    { new: true }
  );

  if (!driver) {
    throw new Error('Driver not found');
  }

  // If driver was assigned to a vehicle, unassign
  if (driver.assignedVehicle) {
    await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
      $set: { assignedDriver: null },
    });
  }

  return driver;
};

/**
 * Assign vehicle to driver
 * @param {String} driverId - Driver ID
 * @param {String} vehicleId - Vehicle ID
 * @returns {Promise<Object>} Updated driver
 */
const assignVehicle = async (driverId, vehicleId) => {
  // Check if driver exists
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }

  if (driver.status !== 'active') {
    throw new Error('Cannot assign vehicle to inactive driver');
  }

  // Check if vehicle exists and is active
  const vehicle = await Vehicle.findById(vehicleId);
  if (!vehicle) {
    throw new Error('Vehicle not found');
  }

  if (vehicle.status !== 'active') {
    throw new Error('Cannot assign inactive vehicle to driver');
  }

  // If vehicle is already assigned to another driver, unassign
  if (vehicle.assignedDriver && vehicle.assignedDriver.toString() !== driverId) {
    await Driver.findByIdAndUpdate(vehicle.assignedDriver, {
      $set: { assignedVehicle: null },
    });
  }

  // If driver already has a vehicle, unassign that vehicle
  if (driver.assignedVehicle && driver.assignedVehicle.toString() !== vehicleId) {
    await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
      $set: { assignedDriver: null },
    });
  }

  // Assign vehicle to driver
  driver.assignedVehicle = vehicleId;
  await driver.save();

  // Assign driver to vehicle
  vehicle.assignedDriver = driverId;
  await vehicle.save();

  return await Driver.findById(driverId).populate(
    'assignedVehicle',
    'registrationNumber make model vehicleType'
  );
};

/**
 * Unassign vehicle from driver
 * @param {String} driverId - Driver ID
 * @returns {Promise<Object>} Updated driver
 */
const unassignVehicle = async (driverId) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }

  if (driver.assignedVehicle) {
    await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
      $set: { assignedDriver: null },
    });
    driver.assignedVehicle = null;
    await driver.save();
  }

  return await Driver.findById(driverId);
};

/**
 * Update driver status
 * @param {String} driverId - Driver ID
 * @param {String} status - New status
 * @returns {Promise<Object>} Updated driver
 */
const updateStatus = async (driverId, status) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }

  // If setting to inactive, unassign from vehicle
  if (status !== 'active' && driver.assignedVehicle) {
    await Vehicle.findByIdAndUpdate(driver.assignedVehicle, {
      $set: { assignedDriver: null },
    });
    driver.assignedVehicle = null;
  }

  driver.status = status;
  await driver.save();

  return await Driver.findById(driverId).populate(
    'assignedVehicle',
    'registrationNumber make model vehicleType'
  );
};

/**
 * Get drivers by status
 * @param {String} status - Driver status
 * @returns {Promise<Array>} List of drivers
 */
const getDriversByStatus = async (status) => {
  return await Driver.find({ status, isActive: true }).populate(
    'assignedVehicle',
    'registrationNumber make model vehicleType'
  );
};

/**
 * Get available drivers (active and not assigned)
 * @returns {Promise<Array>} List of available drivers
 */
const getAvailableDrivers = async () => {
  return await Driver.find({
    status: 'active',
    isActive: true,
    assignedVehicle: null,
  });
};

/**
 * Get driver statistics
 * @returns {Promise<Object>} Driver statistics
 */
const getDriverStats = async () => {
  const stats = await Driver.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        active: { $sum: { $cond: [{ $eq: ['$status', 'active'] }, 1, 0] } },
        onLeave: { $sum: { $cond: [{ $eq: ['$status', 'on-leave'] }, 1, 0] } },
        inactive: { $sum: { $cond: [{ $eq: ['$status', 'inactive'] }, 1, 0] } },
        suspended: { $sum: { $cond: [{ $eq: ['$status', 'suspended'] }, 1, 0] } },
        assigned: { $sum: { $cond: [{ $ne: ['$assignedVehicle', null] }, 1, 0] } },
        unassigned: { $sum: { $cond: [{ $eq: ['$assignedVehicle', null] }, 1, 0] } },
        avgExperience: { $avg: '$experience' },
      },
    },
  ]);

  // Get license type distribution
  const licenseDistribution = await Driver.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: '$licenseType',
        count: { $sum: 1 },
      },
    },
  ]);

  // Get drivers with expired licenses
  const expiredLicenses = await Driver.find({
    isActive: true,
    licenseExpiry: { $lt: new Date() },
  }).countDocuments();

  // Get drivers with licenses expiring in next 30 days
  const thirtyDaysFromNow = new Date();
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

  const expiringLicenses = await Driver.find({
    isActive: true,
    licenseExpiry: {
      $gte: new Date(),
      $lte: thirtyDaysFromNow,
    },
  }).countDocuments();

  return {
    overview: stats[0] || {
      total: 0,
      active: 0,
      onLeave: 0,
      inactive: 0,
      suspended: 0,
      assigned: 0,
      unassigned: 0,
      avgExperience: 0,
    },
    licenseDistribution,
    expiredLicenses,
    expiringLicenses,
  };
};

/**
 * Get drivers with expired licenses
 * @returns {Promise<Array>} List of drivers with expired licenses
 */
const getDriversWithExpiredLicenses = async () => {
  return await Driver.find({
    isActive: true,
    licenseExpiry: { $lt: new Date() },
  }).populate('assignedVehicle', 'registrationNumber make model');
};

/**
 * Get drivers with licenses expiring soon
 * @param {Number} days - Number of days threshold
 * @returns {Promise<Array>} List of drivers with licenses expiring soon
 */
const getDriversWithExpiringLicenses = async (days = 30) => {
  const startDate = new Date();
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + days);

  return await Driver.find({
    isActive: true,
    licenseExpiry: {
      $gte: startDate,
      $lte: endDate,
    },
  }).populate('assignedVehicle', 'registrationNumber make model');
};

/**
 * Search drivers
 * @param {String} searchTerm - Search term
 * @returns {Promise<Array>} Matching drivers
 */
const searchDrivers = async (searchTerm) => {
  return await Driver.find({
    isActive: true,
    $or: [
      { employeeId: { $regex: searchTerm, $options: 'i' } },
      { firstName: { $regex: searchTerm, $options: 'i' } },
      { lastName: { $regex: searchTerm, $options: 'i' } },
      { email: { $regex: searchTerm, $options: 'i' } },
      { licenseNumber: { $regex: searchTerm, $options: 'i' } },
    ],
  }).populate('assignedVehicle', 'registrationNumber make model vehicleType');
};

/**
 * Add document to driver
 * @param {String} driverId - Driver ID
 * @param {Object} documentData - Document data
 * @returns {Promise<Object>} Updated driver
 */
const addDocument = async (driverId, documentData) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }

  driver.documents.push(documentData);
  await driver.save();

  return driver;
};

/**
 * Remove document from driver
 * @param {String} driverId - Driver ID
 * @param {String} documentId - Document ID
 * @returns {Promise<Object>} Updated driver
 */
const removeDocument = async (driverId, documentId) => {
  const driver = await Driver.findById(driverId);
  if (!driver) {
    throw new Error('Driver not found');
  }

  driver.documents = driver.documents.filter(
    (doc) => doc._id.toString() !== documentId
  );
  await driver.save();

  return driver;
};

module.exports = {
  createDriver,
  getAllDrivers,
  getDriverById,
  updateDriver,
  deleteDriver,
  assignVehicle,
  unassignVehicle,
  updateStatus,
  getDriversByStatus,
  getAvailableDrivers,
  getDriverStats,
  getDriversWithExpiredLicenses,
  getDriversWithExpiringLicenses,
  searchDrivers,
  addDocument,
  removeDocument,
};

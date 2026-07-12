import api from './api';

const DRIVERS_BASE_URL = '/drivers';

/**
 * Get all drivers with pagination and filtering
 * @param {Object} params - Query parameters
 * @returns {Promise} Drivers data
 */
export const getDrivers = async (params = {}) => {
  const response = await api.get(DRIVERS_BASE_URL, { params });
  return response.data;
};

/**
 * Get driver by ID
 * @param {String} id - Driver ID
 * @returns {Promise} Driver data
 */
export const getDriverById = async (id) => {
  const response = await api.get(`${DRIVERS_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create new driver
 * @param {Object} driverData - Driver data
 * @returns {Promise} Created driver
 */
export const createDriver = async (driverData) => {
  const response = await api.post(DRIVERS_BASE_URL, driverData);
  return response.data;
};

/**
 * Update driver
 * @param {String} id - Driver ID
 * @param {Object} driverData - Updated driver data
 * @returns {Promise} Updated driver
 */
export const updateDriver = async (id, driverData) => {
  const response = await api.put(`${DRIVERS_BASE_URL}/${id}`, driverData);
  return response.data;
};

/**
 * Delete driver
 * @param {String} id - Driver ID
 * @returns {Promise} Deleted driver
 */
export const deleteDriver = async (id) => {
  const response = await api.delete(`${DRIVERS_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Assign vehicle to driver
 * @param {String} driverId - Driver ID
 * @param {String} vehicleId - Vehicle ID
 * @returns {Promise} Updated driver
 */
export const assignVehicle = async (driverId, vehicleId) => {
  const response = await api.put(`${DRIVERS_BASE_URL}/${driverId}/assign-vehicle`, {
    vehicleId,
  });
  return response.data;
};

/**
 * Unassign vehicle from driver
 * @param {String} driverId - Driver ID
 * @returns {Promise} Updated driver
 */
export const unassignVehicle = async (driverId) => {
  const response = await api.put(`${DRIVERS_BASE_URL}/${driverId}/unassign-vehicle`);
  return response.data;
};

/**
 * Update driver status
 * @param {String} driverId - Driver ID
 * @param {String} status - New status
 * @returns {Promise} Updated driver
 */
export const updateStatus = async (driverId, status) => {
  const response = await api.put(`${DRIVERS_BASE_URL}/${driverId}/status`, {
    status,
  });
  return response.data;
};

/**
 * Get available drivers
 * @returns {Promise} List of available drivers
 */
export const getAvailableDrivers = async () => {
  const response = await api.get(`${DRIVERS_BASE_URL}/available`);
  return response.data;
};

/**
 * Get driver statistics
 * @returns {Promise} Driver statistics
 */
export const getDriverStats = async () => {
  const response = await api.get(`${DRIVERS_BASE_URL}/stats`);
  return response.data;
};

/**
 * Search drivers
 * @param {String} searchTerm - Search term
 * @returns {Promise} Search results
 */
export const searchDrivers = async (searchTerm) => {
  const response = await api.get(`${DRIVERS_BASE_URL}/search`, {
    params: { q: searchTerm },
  });
  return response.data;
};

/**
 * Get drivers by status
 * @param {String} status - Driver status
 * @returns {Promise} List of drivers
 */
export const getDriversByStatus = async (status) => {
  const response = await api.get(`${DRIVERS_BASE_URL}/status/${status}`);
  return response.data;
};

/**
 * Get drivers with expired licenses
 * @returns {Promise} List of drivers with expired licenses
 */
export const getDriversWithExpiredLicenses = async () => {
  const response = await api.get(`${DRIVERS_BASE_URL}/expired-licenses`);
  return response.data;
};

/**
 * Get drivers with licenses expiring soon
 * @param {Number} days - Number of days threshold
 * @returns {Promise} List of drivers with expiring licenses
 */
export const getDriversWithExpiringLicenses = async (days = 30) => {
  const response = await api.get(`${DRIVERS_BASE_URL}/expiring-licenses`, {
    params: { days },
  });
  return response.data;
};

/**
 * Add document to driver
 * @param {String} driverId - Driver ID
 * @param {Object} documentData - Document data
 * @returns {Promise} Updated driver
 */
export const addDocument = async (driverId, documentData) => {
  const response = await api.post(`${DRIVERS_BASE_URL}/${driverId}/documents`, documentData);
  return response.data;
};

/**
 * Remove document from driver
 * @param {String} driverId - Driver ID
 * @param {String} documentId - Document ID
 * @returns {Promise} Updated driver
 */
export const removeDocument = async (driverId, documentId) => {
  const response = await api.delete(`${DRIVERS_BASE_URL}/${driverId}/documents/${documentId}`);
  return response.data;
};

export default {
  getDrivers,
  getDriverById,
  createDriver,
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

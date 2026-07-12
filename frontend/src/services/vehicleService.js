import api from './api';

const VEHICLES_BASE_URL = '/vehicles';

/**
 * Get all vehicles with pagination and filtering
 * @param {Object} params - Query parameters
 * @returns {Promise} Vehicles data
 */
export const getVehicles = async (params = {}) => {
  const response = await api.get(VEHICLES_BASE_URL, { params });
  return response.data;
};

/**
 * Get vehicle by ID
 * @param {String} id - Vehicle ID
 * @returns {Promise} Vehicle data
 */
export const getVehicleById = async (id) => {
  const response = await api.get(`${VEHICLES_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Create new vehicle
 * @param {Object} vehicleData - Vehicle data
 * @returns {Promise} Created vehicle
 */
export const createVehicle = async (vehicleData) => {
  const response = await api.post(VEHICLES_BASE_URL, vehicleData);
  return response.data;
};

/**
 * Update vehicle
 * @param {String} id - Vehicle ID
 * @param {Object} vehicleData - Updated vehicle data
 * @returns {Promise} Updated vehicle
 */
export const updateVehicle = async (id, vehicleData) => {
  const response = await api.put(`${VEHICLES_BASE_URL}/${id}`, vehicleData);
  return response.data;
};

/**
 * Delete vehicle
 * @param {String} id - Vehicle ID
 * @returns {Promise} Deleted vehicle
 */
export const deleteVehicle = async (id) => {
  const response = await api.delete(`${VEHICLES_BASE_URL}/${id}`);
  return response.data;
};

/**
 * Assign driver to vehicle
 * @param {String} vehicleId - Vehicle ID
 * @param {String} driverId - Driver ID
 * @returns {Promise} Updated vehicle
 */
export const assignDriver = async (vehicleId, driverId) => {
  const response = await api.put(`${VEHICLES_BASE_URL}/${vehicleId}/assign-driver`, {
    driverId,
  });
  return response.data;
};

/**
 * Unassign driver from vehicle
 * @param {String} vehicleId - Vehicle ID
 * @returns {Promise} Updated vehicle
 */
export const unassignDriver = async (vehicleId) => {
  const response = await api.put(`${VEHICLES_BASE_URL}/${vehicleId}/unassign-driver`);
  return response.data;
};

/**
 * Update vehicle mileage
 * @param {String} vehicleId - Vehicle ID
 * @param {Number} mileage - New mileage
 * @returns {Promise} Updated vehicle
 */
export const updateMileage = async (vehicleId, mileage) => {
  const response = await api.put(`${VEHICLES_BASE_URL}/${vehicleId}/mileage`, {
    mileage,
  });
  return response.data;
};

/**
 * Get available vehicles
 * @returns {Promise} List of available vehicles
 */
export const getAvailableVehicles = async () => {
  const response = await api.get(`${VEHICLES_BASE_URL}/available`);
  return response.data;
};

/**
 * Get vehicle statistics
 * @returns {Promise} Vehicle statistics
 */
export const getVehicleStats = async () => {
  const response = await api.get(`${VEHICLES_BASE_URL}/stats`);
  return response.data;
};

/**
 * Search vehicles
 * @param {String} searchTerm - Search term
 * @returns {Promise} Search results
 */
export const searchVehicles = async (searchTerm) => {
  const response = await api.get(`${VEHICLES_BASE_URL}/search`, {
    params: { q: searchTerm },
  });
  return response.data;
};

/**
 * Get vehicles by status
 * @param {String} status - Vehicle status
 * @returns {Promise} List of vehicles
 */
export const getVehiclesByStatus = async (status) => {
  const response = await api.get(`${VEHICLES_BASE_URL}/status/${status}`);
  return response.data;
};

export default {
  getVehicles,
  getVehicleById,
  createVehicle,
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

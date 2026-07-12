import axios from 'axios';

const API_BASE_URL = '/api';

export const vehicleService = {
  // Get all vehicles with optional filters
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_BASE_URL}/vehicles?${params}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get available vehicles for trip dispatch
  getAvailable: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles/available`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single vehicle by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new vehicle
  create: async (vehicleData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/vehicles`, vehicleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle
  update: async (id, vehicleData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/vehicles/${id}`, vehicleData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update vehicle status (for trip/maintenance operations)
  updateStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/vehicles/${id}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete vehicle
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/vehicles/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get vehicle statistics
  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles/stats`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk operations
  bulkUpdateStatus: async (vehicleIds, status) => {
    try {
      const promises = vehicleIds.map(id =>
        axios.patch(`${API_BASE_URL}/vehicles/${id}/status`, { status })
      );
      const responses = await Promise.all(promises);
      return responses;
    } catch (error) {
      throw error;
    }
  },

  // Search vehicles by registration number
  searchByRegistration: async (registrationNumber) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/vehicles?registrationNumber=${encodeURIComponent(registrationNumber)}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get vehicles by type
  getByType: async (vehicleType) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles?vehicleType=${vehicleType}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get vehicles by status
  getByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles?status=${status}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Validate registration number uniqueness
  validateRegistrationNumber: async (registrationNumber, excludeId = null) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/vehicles`);
      const vehicles = response.data;

      const existingVehicle = vehicles.find(vehicle =>
        vehicle.registrationNumber.toUpperCase() === registrationNumber.toUpperCase() &&
        (!excludeId || vehicle._id !== excludeId)
      );

      return !existingVehicle;
    } catch (error) {
      throw error;
    }
  },

  // Export vehicles data
  exportData: async (format = 'json', filters = {}) => {
    try {
      const params = new URLSearchParams({ ...filters, format }).toString();
      const response = await axios.get(`${API_BASE_URL}/vehicles/export?${params}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Default export for backward compatibility
export default vehicleService;

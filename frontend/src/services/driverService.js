import axios from 'axios';

const API_BASE_URL = '/api';

export const driverService = {
  // Get all drivers with optional filters
  getAll: async (filters = {}) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`${API_BASE_URL}/drivers?${params}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get available drivers for trip dispatch
  getAvailable: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/available`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get drivers with expired licenses
  getExpired: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/expired`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get single driver by ID
  getById: async (id) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Create new driver
  create: async (driverData) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/drivers`, driverData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update driver
  update: async (id, driverData) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/drivers/${id}`, driverData);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Update driver status (for trip operations)
  updateStatus: async (id, status) => {
    try {
      const response = await axios.patch(`${API_BASE_URL}/drivers/${id}/status`, { status });
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Delete driver
  delete: async (id) => {
    try {
      const response = await axios.delete(`${API_BASE_URL}/drivers/${id}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get driver statistics
  getStats: async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/stats`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get drivers expiring soon (within specified days)
  getExpiringSoon: async (days = 30) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers/expiring-soon?days=${days}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Bulk operations
  bulkUpdateStatus: async (driverIds, status) => {
    try {
      const promises = driverIds.map(id =>
        axios.patch(`${API_BASE_URL}/drivers/${id}/status`, { status })
      );
      const responses = await Promise.all(promises);
      return responses;
    } catch (error) {
      throw error;
    }
  },

  // Search drivers by name or license number
  search: async (searchTerm) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/drivers?search=${encodeURIComponent(searchTerm)}`
      );
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get drivers by license category
  getByLicenseCategory: async (category) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers?licenseCategory=${category}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Get drivers by status
  getByStatus: async (status) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers?status=${status}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Validate license number uniqueness
  validateLicenseNumber: async (licenseNumber, excludeId = null) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/drivers`);
      const drivers = response.data;

      const existingDriver = drivers.find(driver =>
        driver.licenseNumber.toUpperCase() === licenseNumber.toUpperCase() &&
        (!excludeId || driver._id !== excludeId)
      );

      return !existingDriver;
    } catch (error) {
      throw error;
    }
  },

  // Check license expiry status
  checkLicenseExpiry: (expiryDate) => {
    const today = new Date();
    const expiry = new Date(expiryDate);
    const daysUntilExpiry = Math.ceil((expiry - today) / (1000 * 60 * 60 * 24));

    return {
      isExpired: daysUntilExpiry <= 0,
      isExpiringSoon: daysUntilExpiry > 0 && daysUntilExpiry <= 30,
      daysUntilExpiry: daysUntilExpiry
    };
  },

  // Get safety score analysis
  analyzeSafetyScore: (safetyScore) => {
    if (safetyScore >= 80) {
      return { level: 'excellent', color: 'green', message: 'Excellent safety record' };
    } else if (safetyScore >= 60) {
      return { level: 'good', color: 'yellow', message: 'Good safety record' };
    } else {
      return { level: 'poor', color: 'red', message: 'Needs safety improvement' };
    }
  },

  // Export drivers data
  exportData: async (format = 'json', filters = {}) => {
    try {
      const params = new URLSearchParams({ ...filters, format }).toString();
      const response = await axios.get(`${API_BASE_URL}/drivers/export?${params}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });
      return response;
    } catch (error) {
      throw error;
    }
  }
};

// Default export for backward compatibility
export default driverService;

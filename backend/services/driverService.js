const Driver = require('../models/Driver');

const driverService = {
  // Get all drivers with filtering and pagination
  getAllDrivers: async (filters = {}, options = {}) => {
    try {
      const { status, includeExpired, limit = 50, skip = 0 } = { ...filters, ...options };
      let query = {};

      if (status) query.status = status;

      // Exclude expired drivers unless explicitly requested
      if (includeExpired !== 'true') {
        query.licenseExpiryDate = { $gt: new Date() };
      }

      const drivers = await Driver.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      // Add computed fields for license status
      const driversWithStatus = drivers.map(driver => {
        const driverObj = driver.toObject();
        driverObj.isLicenseExpired = driver.isLicenseExpired;
        driverObj.isEligibleForTrip = driver.isEligibleForTrip;
        return driverObj;
      });

      const total = await Driver.countDocuments(query);

      return { drivers: driversWithStatus, total };
    } catch (error) {
      throw new Error(`Failed to fetch drivers: ${error.message}`);
    }
  },

  // Get available drivers for dispatch
  getAvailableDrivers: async () => {
    try {
      const drivers = await Driver.find({
        status: 'Available',
        licenseExpiryDate: { $gt: new Date() }
      }).sort({ name: 1 });

      // Filter by eligibility and add computed fields
      const eligibleDrivers = drivers.filter(driver => driver.isEligibleForTrip);

      return eligibleDrivers.map(driver => {
        const driverObj = driver.toObject();
        driverObj.isLicenseExpired = driver.isLicenseExpired;
        driverObj.isEligibleForTrip = driver.isEligibleForTrip;
        return driverObj;
      });
    } catch (error) {
      throw new Error(`Failed to fetch available drivers: ${error.message}`);
    }
  },

  // Get drivers with expired licenses
  getExpiredDrivers: async () => {
    try {
      const expiredDrivers = await Driver.find({
        licenseExpiryDate: { $lte: new Date() }
      }).sort({ licenseExpiryDate: 1 });

      return expiredDrivers.map(driver => {
        const driverObj = driver.toObject();
        driverObj.isLicenseExpired = driver.isLicenseExpired;
        driverObj.isEligibleForTrip = driver.isEligibleForTrip;
        return driverObj;
      });
    } catch (error) {
      throw new Error(`Failed to fetch expired drivers: ${error.message}`);
    }
  },

  // Get drivers with licenses expiring soon
  getDriversExpiringSoon: async (days = 30) => {
    try {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + days);

      const drivers = await Driver.find({
        licenseExpiryDate: {
          $gt: new Date(),
          $lte: futureDate
        }
      }).sort({ licenseExpiryDate: 1 });

      return drivers.map(driver => {
        const driverObj = driver.toObject();
        driverObj.isLicenseExpired = driver.isLicenseExpired;
        driverObj.isEligibleForTrip = driver.isEligibleForTrip;
        driverObj.daysUntilExpiry = Math.ceil((driver.licenseExpiryDate - new Date()) / (1000 * 60 * 60 * 24));
        return driverObj;
      });
    } catch (error) {
      throw new Error(`Failed to fetch drivers expiring soon: ${error.message}`);
    }
  },

  // Get driver by ID
  getDriverById: async (id) => {
    try {
      const driver = await Driver.findById(id);
      if (!driver) {
        throw new Error('Driver not found');
      }

      const driverObj = driver.toObject();
      driverObj.isLicenseExpired = driver.isLicenseExpired;
      driverObj.isEligibleForTrip = driver.isEligibleForTrip;

      return driverObj;
    } catch (error) {
      throw new Error(`Failed to fetch driver: ${error.message}`);
    }
  },

  // Create new driver
  createDriver: async (driverData) => {
    try {
      // Validate license expiry date
      if (new Date(driverData.licenseExpiryDate) <= new Date()) {
        throw new Error('License expiry date must be in the future');
      }

      // Check if license number already exists
      const existingDriver = await Driver.findOne({
        licenseNumber: driverData.licenseNumber
      });

      if (existingDriver) {
        throw new Error('License number already exists');
      }

      const driver = new Driver(driverData);
      const savedDriver = await driver.save();

      const driverObj = savedDriver.toObject();
      driverObj.isLicenseExpired = savedDriver.isLicenseExpired;
      driverObj.isEligibleForTrip = savedDriver.isEligibleForTrip;

      return driverObj;
    } catch (error) {
      throw new Error(`Failed to create driver: ${error.message}`);
    }
  },

  // Update driver
  updateDriver: async (id, updateData) => {
    try {
      // Validate license expiry date if provided
      if (updateData.licenseExpiryDate && new Date(updateData.licenseExpiryDate) <= new Date()) {
        throw new Error('License expiry date must be in the future');
      }

      // If updating license number, check uniqueness
      if (updateData.licenseNumber) {
        const existingDriver = await Driver.findOne({
          licenseNumber: updateData.licenseNumber,
          _id: { $ne: id }
        });

        if (existingDriver) {
          throw new Error('License number already exists');
        }
      }

      const driver = await Driver.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!driver) {
        throw new Error('Driver not found');
      }

      const driverObj = driver.toObject();
      driverObj.isLicenseExpired = driver.isLicenseExpired;
      driverObj.isEligibleForTrip = driver.isEligibleForTrip;

      return driverObj;
    } catch (error) {
      throw new Error(`Failed to update driver: ${error.message}`);
    }
  },

  // Update driver status
  updateDriverStatus: async (id, status) => {
    try {
      const validStatuses = ['Available', 'On Trip', 'Off Duty', 'Suspended'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const driver = await Driver.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!driver) {
        throw new Error('Driver not found');
      }

      const driverObj = driver.toObject();
      driverObj.isLicenseExpired = driver.isLicenseExpired;
      driverObj.isEligibleForTrip = driver.isEligibleForTrip;

      return driverObj;
    } catch (error) {
      throw new Error(`Failed to update driver status: ${error.message}`);
    }
  },

  // Delete driver
  deleteDriver: async (id) => {
    try {
      const driver = await Driver.findByIdAndDelete(id);
      if (!driver) {
        throw new Error('Driver not found');
      }
      return { message: 'Driver deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete driver: ${error.message}`);
    }
  },

  // Get driver statistics
  getDriverStats: async () => {
    try {
      const stats = await Driver.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            avgSafetyScore: { $avg: '$safetyScore' }
          }
        }
      ]);

      const total = await Driver.countDocuments();
      const expiredCount = await Driver.countDocuments({
        licenseExpiryDate: { $lte: new Date() }
      });

      return {
        total,
        expired: expiredCount,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = {
            count: stat.count,
            avgSafetyScore: Math.round(stat.avgSafetyScore || 0)
          };
          return acc;
        }, {})
      };
    } catch (error) {
      throw new Error(`Failed to fetch driver statistics: ${error.message}`);
    }
  }
};

module.exports = driverService;

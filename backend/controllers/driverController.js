const Driver = require('../models/Driver');

const driverController = {
  // Get all drivers with optional filters
  getAllDrivers: async (req, res) => {
    try {
      const { status, includeExpired } = req.query;
      let filter = {};

      if (status) filter.status = status;

      const drivers = await Driver.find(filter).sort({ createdAt: -1 });

      // Add computed fields for license status
      const driversWithStatus = drivers.map(driver => {
        const driverObj = driver.toObject();
        driverObj.isLicenseExpired = driver.isLicenseExpired;
        driverObj.isEligibleForTrip = driver.isEligibleForTrip;
        return driverObj;
      });

      // Filter out expired drivers unless explicitly requested
      if (includeExpired !== 'true') {
        const validDrivers = driversWithStatus.filter(driver => !driver.isLicenseExpired);
        return res.json(validDrivers);
      }

      res.json(driversWithStatus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get only available drivers for trip dispatch
  getAvailableDrivers: async (req, res) => {
    try {
      const drivers = await Driver.find({
        status: 'Available',
        licenseExpiryDate: { $gt: new Date() } // Not expired
      }).sort({ name: 1 });

      // Double-check eligibility with virtual
      const eligibleDrivers = drivers.filter(driver => driver.isEligibleForTrip);

      const driversWithStatus = eligibleDrivers.map(driver => {
        const driverObj = driver.toObject();
        driverObj.isLicenseExpired = driver.isLicenseExpired;
        driverObj.isEligibleForTrip = driver.isEligibleForTrip;
        return driverObj;
      });

      res.json(driversWithStatus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get drivers with expired licenses
  getExpiredDrivers: async (req, res) => {
    try {
      const expiredDrivers = await Driver.find({
        licenseExpiryDate: { $lte: new Date() }
      }).sort({ licenseExpiryDate: 1 });

      const driversWithStatus = expiredDrivers.map(driver => {
        const driverObj = driver.toObject();
        driverObj.isLicenseExpired = driver.isLicenseExpired;
        driverObj.isEligibleForTrip = driver.isEligibleForTrip;
        return driverObj;
      });

      res.json(driversWithStatus);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single driver
  getDriverById: async (req, res) => {
    try {
      const driver = await Driver.findById(req.params.id);
      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      const driverObj = driver.toObject();
      driverObj.isLicenseExpired = driver.isLicenseExpired;
      driverObj.isEligibleForTrip = driver.isEligibleForTrip;

      res.json(driverObj);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new driver
  createDriver: async (req, res) => {
    try {
      // Validate license expiry date is in the future
      if (new Date(req.body.licenseExpiryDate) <= new Date()) {
        return res.status(400).json({
          error: 'License expiry date must be in the future'
        });
      }

      const driver = new Driver(req.body);
      await driver.save();

      const driverObj = driver.toObject();
      driverObj.isLicenseExpired = driver.isLicenseExpired;
      driverObj.isEligibleForTrip = driver.isEligibleForTrip;

      res.status(201).json(driverObj);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({
          error: 'License number already exists. Driver license number must be unique.'
        });
      } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ error: errors.join(', ') });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Update driver
  updateDriver: async (req, res) => {
    try {
      // Validate license expiry date if provided
      if (req.body.licenseExpiryDate && new Date(req.body.licenseExpiryDate) <= new Date()) {
        return res.status(400).json({
          error: 'License expiry date must be in the future'
        });
      }

      const driver = await Driver.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      const driverObj = driver.toObject();
      driverObj.isLicenseExpired = driver.isLicenseExpired;
      driverObj.isEligibleForTrip = driver.isEligibleForTrip;

      res.json(driverObj);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({
          error: 'License number already exists. Driver license number must be unique.'
        });
      } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ error: errors.join(', ') });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Update driver status (for trip operations)
  updateDriverStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!['Available', 'On Trip', 'Off Duty', 'Suspended'].includes(status)) {
        return res.status(400).json({
          error: 'Invalid status. Must be Available, On Trip, Off Duty, or Suspended.'
        });
      }

      const driver = await Driver.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      const driverObj = driver.toObject();
      driverObj.isLicenseExpired = driver.isLicenseExpired;
      driverObj.isEligibleForTrip = driver.isEligibleForTrip;

      res.json(driverObj);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete driver
  deleteDriver: async (req, res) => {
    try {
      const driver = await Driver.findByIdAndDelete(req.params.id);

      if (!driver) {
        return res.status(404).json({ error: 'Driver not found' });
      }

      res.json({ message: 'Driver deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = driverController;

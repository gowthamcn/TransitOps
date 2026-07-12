const Vehicle = require('../models/Vehicle');

const vehicleController = {
  // Get all vehicles with optional filters
  getAllVehicles: async (req, res) => {
    try {
      const { status, vehicleType } = req.query;
      let filter = {};

      if (status) filter.status = status;
      if (vehicleType) filter.vehicleType = vehicleType;

      const vehicles = await Vehicle.find(filter).sort({ createdAt: -1 });
      res.json(vehicles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get only available vehicles (for trip dispatch)
  getAvailableVehicles: async (req, res) => {
    try {
      const availableVehicles = await Vehicle.find({
        status: 'Available'
      }).sort({ registrationNumber: 1 });
      res.json(availableVehicles);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Get single vehicle
  getVehicleById: async (req, res) => {
    try {
      const vehicle = await Vehicle.findById(req.params.id);
      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }
      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Create new vehicle
  createVehicle: async (req, res) => {
    try {
      const vehicle = new Vehicle(req.body);
      await vehicle.save();
      res.status(201).json(vehicle);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({
          error: 'Registration number already exists. Vehicle registration number must be unique.'
        });
      } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ error: errors.join(', ') });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Update vehicle
  updateVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      res.json(vehicle);
    } catch (error) {
      if (error.code === 11000) {
        res.status(400).json({
          error: 'Registration number already exists. Vehicle registration number must be unique.'
        });
      } else if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        res.status(400).json({ error: errors.join(', ') });
      } else {
        res.status(500).json({ error: error.message });
      }
    }
  },

  // Update vehicle status (for trip/maintenance operations)
  updateVehicleStatus: async (req, res) => {
    try {
      const { status } = req.body;

      if (!['Available', 'On Trip', 'In Shop', 'Retired'].includes(status)) {
        return res.status(400).json({
          error: 'Invalid status. Must be Available, On Trip, In Shop, or Retired.'
        });
      }

      const vehicle = await Vehicle.findByIdAndUpdate(
        req.params.id,
        { status },
        { new: true }
      );

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      res.json(vehicle);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  },

  // Delete vehicle
  deleteVehicle: async (req, res) => {
    try {
      const vehicle = await Vehicle.findByIdAndDelete(req.params.id);

      if (!vehicle) {
        return res.status(404).json({ error: 'Vehicle not found' });
      }

      res.json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }
};

module.exports = vehicleController;

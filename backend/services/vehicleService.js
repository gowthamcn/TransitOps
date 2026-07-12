const Vehicle = require('../models/Vehicle');

const vehicleService = {
  // Get all vehicles with filtering and pagination
  getAllVehicles: async (filters = {}, options = {}) => {
    try {
      const { status, vehicleType, limit = 50, skip = 0 } = { ...filters, ...options };
      let query = {};

      if (status) query.status = status;
      if (vehicleType) query.vehicleType = vehicleType;

      const vehicles = await Vehicle.find(query)
        .sort({ createdAt: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));

      const total = await Vehicle.countDocuments(query);

      return { vehicles, total };
    } catch (error) {
      throw new Error(`Failed to fetch vehicles: ${error.message}`);
    }
  },

  // Get available vehicles for dispatch
  getAvailableVehicles: async () => {
    try {
      return await Vehicle.find({
        status: 'Available'
      }).sort({ registrationNumber: 1 });
    } catch (error) {
      throw new Error(`Failed to fetch available vehicles: ${error.message}`);
    }
  },

  // Get vehicle by ID
  getVehicleById: async (id) => {
    try {
      const vehicle = await Vehicle.findById(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      return vehicle;
    } catch (error) {
      throw new Error(`Failed to fetch vehicle: ${error.message}`);
    }
  },

  // Create new vehicle
  createVehicle: async (vehicleData) => {
    try {
      // Check if registration number already exists
      const existingVehicle = await Vehicle.findOne({
        registrationNumber: vehicleData.registrationNumber
      });

      if (existingVehicle) {
        throw new Error('Registration number already exists');
      }

      const vehicle = new Vehicle(vehicleData);
      return await vehicle.save();
    } catch (error) {
      throw new Error(`Failed to create vehicle: ${error.message}`);
    }
  },

  // Update vehicle
  updateVehicle: async (id, updateData) => {
    try {
      // If updating registration number, check uniqueness
      if (updateData.registrationNumber) {
        const existingVehicle = await Vehicle.findOne({
          registrationNumber: updateData.registrationNumber,
          _id: { $ne: id }
        });

        if (existingVehicle) {
          throw new Error('Registration number already exists');
        }
      }

      const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        updateData,
        { new: true, runValidators: true }
      );

      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      return vehicle;
    } catch (error) {
      throw new Error(`Failed to update vehicle: ${error.message}`);
    }
  },

  // Update vehicle status
  updateVehicleStatus: async (id, status) => {
    try {
      const validStatuses = ['Available', 'On Trip', 'In Shop', 'Retired'];
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const vehicle = await Vehicle.findByIdAndUpdate(
        id,
        { status },
        { new: true }
      );

      if (!vehicle) {
        throw new Error('Vehicle not found');
      }

      return vehicle;
    } catch (error) {
      throw new Error(`Failed to update vehicle status: ${error.message}`);
    }
  },

  // Delete vehicle
  deleteVehicle: async (id) => {
    try {
      const vehicle = await Vehicle.findByIdAndDelete(id);
      if (!vehicle) {
        throw new Error('Vehicle not found');
      }
      return { message: 'Vehicle deleted successfully' };
    } catch (error) {
      throw new Error(`Failed to delete vehicle: ${error.message}`);
    }
  },

  // Get vehicle statistics
  getVehicleStats: async () => {
    try {
      const stats = await Vehicle.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 }
          }
        }
      ]);

      const total = await Vehicle.countDocuments();

      return {
        total,
        byStatus: stats.reduce((acc, stat) => {
          acc[stat._id] = stat.count;
          return acc;
        }, {})
      };
    } catch (error) {
      throw new Error(`Failed to fetch vehicle statistics: ${error.message}`);
    }
  }
};

module.exports = vehicleService;

const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    uppercase: true
  },
  vehicleName: {
    type: String,
    required: true,
    trim: true
  },
  vehicleModel: {
    type: String,
    required: true,
    trim: true
  },
  vehicleType: {
    type: String,
    required: true,
    enum: ['Truck', 'Van', 'Car', 'Bus', 'Motorcycle']
  },
  maxLoadCapacity: {
    type: Number,
    required: true,
    min: 0
  },
  odometer: {
    type: Number,
    required: true,
    min: 0,
    default: 0
  },
  acquisitionCost: {
    type: Number,
    required: true,
    min: 0
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'On Trip', 'In Shop', 'Retired'],
    default: 'Available'
  }
}, {
  timestamps: true
});

// Index for performance
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ status: 1 });

module.exports = mongoose.model('Vehicle', vehicleSchema);

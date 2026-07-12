const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    registrationNumber: {
      type: String,
      required: [true, 'Registration number is required'],
      unique: true,
      trim: true,
      uppercase: true,
    },
    vehicleType: {
      type: String,
      required: [true, 'Vehicle type is required'],
      enum: ['bus', 'minibus', 'van', 'truck', 'other'],
      default: 'bus',
    },
    make: {
      type: String,
      required: [true, 'Vehicle make is required'],
      trim: true,
    },
    model: {
      type: String,
      required: [true, 'Vehicle model is required'],
      trim: true,
    },
    year: {
      type: Number,
      required: [true, 'Manufacturing year is required'],
      min: [1900, 'Year must be at least 1900'],
      max: [new Date().getFullYear() + 1, 'Year cannot be in the future'],
    },
    color: {
      type: String,
      trim: true,
    },
    seatingCapacity: {
      type: Number,
      required: [true, 'Seating capacity is required'],
      min: [1, 'Seating capacity must be at least 1'],
    },
    fuelType: {
      type: String,
      enum: ['petrol', 'diesel', 'electric', 'hybrid', 'cng'],
      default: 'diesel',
    },
    status: {
      type: String,
      enum: ['active', 'maintenance', 'inactive', 'retired'],
      default: 'active',
    },
    assignedDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      default: null,
    },
    currentMileage: {
      type: Number,
      default: 0,
      min: [0, 'Mileage cannot be negative'],
    },
    lastServiceDate: {
      type: Date,
      default: null,
    },
    insuranceExpiry: {
      type: Date,
      default: null,
    },
    registrationExpiry: {
      type: Date,
      default: null,
    },
    imageUrl: {
      type: String,
      default: '',
    },
    notes: {
      type: String,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries
vehicleSchema.index({ registrationNumber: 1 });
vehicleSchema.index({ status: 1 });
vehicleSchema.index({ assignedDriver: 1 });

// Virtual for checking if insurance is expired
vehicleSchema.virtual('isInsuranceExpired').get(function () {
  if (!this.insuranceExpiry) return false;
  return new Date() > this.insuranceExpiry;
});

// Virtual for checking if registration is expired
vehicleSchema.virtual('isRegistrationExpired').get(function () {
  if (!this.registrationExpiry) return false;
  return new Date() > this.registrationExpiry;
});

// Ensure virtuals are included in JSON output
vehicleSchema.set('toJSON', { virtuals: true });
vehicleSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);

const mongoose = require('mongoose');

const driverSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  licenseNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  licenseCategory: {
    type: String,
    required: true,
    enum: ['A', 'B', 'C', 'D', 'E', 'A1', 'B1', 'C1', 'D1']
  },
  licenseExpiryDate: {
    type: Date,
    required: true
  },
  contactNumber: {
    type: String,
    required: true,
    trim: true
  },
  safetyScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    default: 100
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'On Trip', 'Off Duty', 'Suspended'],
    default: 'Available'
  }
}, {
  timestamps: true
});

// Virtual for license validity check
driverSchema.virtual('isLicenseExpired').get(function() {
  return new Date() > this.licenseExpiryDate;
});

// Virtual for availability check
driverSchema.virtual('isEligibleForTrip').get(function() {
  return !this.isLicenseExpired &&
         this.status !== 'Suspended' &&
         this.status !== 'On Trip';
});

// Index for performance
driverSchema.index({ licenseNumber: 1 });
driverSchema.index({ status: 1 });
driverSchema.index({ licenseExpiryDate: 1 });

module.exports = mongoose.model('Driver', driverSchema);

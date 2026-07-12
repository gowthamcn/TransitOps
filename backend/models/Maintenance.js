const mongoose = require('mongoose');

const MAINTENANCE_STATUS = {
  OPEN: 'Open',
  CLOSED: 'Closed',
};

const maintenanceSchema = new mongoose.Schema(
  {
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    issue: {
      type: String,
      required: [true, 'Issue is required'],
      trim: true,
      minlength: [2, 'Issue must be at least 2 characters'],
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
    },
    status: {
      type: String,
      enum: {
        values: Object.values(MAINTENANCE_STATUS),
        message: '{VALUE} is not a valid maintenance status',
      },
      default: MAINTENANCE_STATUS.OPEN,
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      default: null,
      validate: {
        validator: function (value) {
          // Only validate when endDate is actually set
          if (!value) return true;
          return value >= this.startDate;
        },
        message: 'End date cannot be before start date',
      },
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt
  }
);

// Indexes supporting required business rules:
// - fast lookup of a vehicle's open maintenance record (dispatch exclusion check)
// - fast lookup of all maintenance records by status
maintenanceSchema.index({ vehicle: 1, status: 1 });
maintenanceSchema.index({ status: 1 });

const Maintenance = mongoose.model('Maintenance', maintenanceSchema);

module.exports = Maintenance;
module.exports.MAINTENANCE_STATUS = MAINTENANCE_STATUS;
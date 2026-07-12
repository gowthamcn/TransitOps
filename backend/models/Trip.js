const mongoose = require('mongoose');

const TRIP_STATUS = {
  DRAFT: 'Draft',
  DISPATCHED: 'Dispatched',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
};

const tripSchema = new mongoose.Schema(
  {
    source: {
      type: String,
      required: [true, 'Source location is required'],
      trim: true,
      minlength: [2, 'Source must be at least 2 characters'],
    },
    destination: {
      type: String,
      required: [true, 'Destination location is required'],
      trim: true,
      minlength: [2, 'Destination must be at least 2 characters'],
      validate: {
        validator: function (value) {
          // Prevent source === destination (case-insensitive)
          return value.toLowerCase() !== this.source?.toLowerCase();
        },
        message: 'Destination cannot be the same as source',
      },
    },
    vehicle: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vehicle',
      required: [true, 'Vehicle is required'],
    },
    driver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Driver',
      required: [true, 'Driver is required'],
    },
    cargoWeight: {
      type: Number,
      required: [true, 'Cargo weight is required'],
      min: [0, 'Cargo weight cannot be negative'],
    },
    plannedDistance: {
      type: Number,
      required: [true, 'Planned distance is required'],
      min: [0.1, 'Planned distance must be greater than 0'],
    },
    status: {
      type: String,
      enum: {
        values: Object.values(TRIP_STATUS),
        message: '{VALUE} is not a valid trip status',
      },
      default: TRIP_STATUS.DRAFT,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    cancellationReason: {
      type: String,
      trim: true,
      default: null,
    },
  },
  {
    timestamps: true, // adds createdAt, updatedAt automatically
  }
);

// Indexes for common query patterns
tripSchema.index({ status: 1 });
tripSchema.index({ vehicle: 1, status: 1 });
tripSchema.index({ driver: 1, status: 1 });
tripSchema.index({ createdAt: -1 });

// Instance helper — not business logic, just a convenience accessor
tripSchema.methods.isActive = function () {
  return this.status === TRIP_STATUS.DISPATCHED;
};

const Trip = mongoose.model('Trip', tripSchema);

module.exports = Trip;
module.exports.TRIP_STATUS = TRIP_STATUS;
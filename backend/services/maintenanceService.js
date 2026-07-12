const mongoose = require('mongoose');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle'); // Member 2's model — confirm field names

const { MAINTENANCE_STATUS } = Maintenance;

const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/* ============================================================
   INTERNAL HELPERS
   ============================================================ */

const findVehicleOrThrow = async (vehicleId, session = null) => {
  const vehicle = await Vehicle.findById(vehicleId).session(session);
  if (!vehicle) throw createError('Vehicle not found', 404);
  return vehicle;
};

const findMaintenanceOrThrow = async (maintenanceId, session = null) => {
  const record = await Maintenance.findById(maintenanceId).session(session);
  if (!record) throw createError('Maintenance record not found', 404);
  return record;
};

/**
 * Enforces: a vehicle cannot have two open maintenance records at once.
 */
const ensureNoExistingOpenMaintenance = async (vehicleId, session = null) => {
  const existing = await Maintenance.findOne({
    vehicle: vehicleId,
    status: MAINTENANCE_STATUS.OPEN,
  }).session(session);

  if (existing) {
    throw createError('Vehicle already has an open maintenance record', 409);
  }
};

/* ============================================================
   EXPORTED SERVICE FUNCTIONS
   ============================================================ */

/**
 * Creates a maintenance record:
 * - Vehicle must exist.
 * - Vehicle must not already have an open maintenance record.
 * - Vehicle status -> In Shop.
 * Runs in a transaction so the Maintenance record and Vehicle status
 * update together or not at all.
 */
const createMaintenance = async (data) => {
  const { vehicle: vehicleId, issue, description, startDate } = data;

  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const vehicle = await findVehicleOrThrow(vehicleId, session);
    await ensureNoExistingOpenMaintenance(vehicleId, session);

    const [record] = await Maintenance.create(
      [
        {
          vehicle: vehicleId,
          issue,
          description,
          startDate,
          status: MAINTENANCE_STATUS.OPEN,
        },
      ],
      { session }
    );

    vehicle.status = 'In Shop';
    await vehicle.save({ session });

    await session.commitTransaction();
    return record;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Returns all maintenance records, with optional filtering by
 * status/vehicle and pagination.
 */
const getAllMaintenance = async (queryParams = {}) => {
  const { status, vehicle, page = 1, limit = 20 } = queryParams;

  const filter = {};
  if (status) filter.status = status;
  if (vehicle) filter.vehicle = vehicle;

  const skip = (Number(page) - 1) * Number(limit);

  const [records, total] = await Promise.all([
    Maintenance.find(filter)
      .populate('vehicle', 'registrationNumber status maxCapacity')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Maintenance.countDocuments(filter),
  ]);

  return {
    records,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getMaintenanceById = async (maintenanceId) => {
  const record = await Maintenance.findById(maintenanceId).populate(
    'vehicle',
    'registrationNumber status maxCapacity'
  );

  if (!record) throw createError('Maintenance record not found', 404);
  return record;
};

/**
 * Updates editable maintenance fields. Only allowed while Open —
 * a Closed record is historical and should not be edited.
 * `status` and `endDate` are stripped so this method can't be used
 * to bypass closeMaintenance() and its Vehicle side-effects.
 */
const updateMaintenance = async (maintenanceId, updates) => {
  const record = await findMaintenanceOrThrow(maintenanceId);

  if (record.status !== MAINTENANCE_STATUS.OPEN) {
    throw createError(`Cannot edit a maintenance record with status '${record.status}'`, 409);
  }

  const { status, endDate, ...safeUpdates } = updates;

  const allowedFields = ['issue', 'description', 'startDate'];
  Object.keys(safeUpdates).forEach((key) => {
    if (allowedFields.includes(key)) {
      record[key] = safeUpdates[key];
    }
  });

  await record.save(); // triggers schema validators (e.g. endDate >= startDate)
  return record;
};

/**
 * Deletes a maintenance record. Only Open records can be deleted —
 * Closed records are operational history and must be preserved.
 * Note: does NOT touch Vehicle status, since a deleted Open record
 * means the maintenance never should have happened; the caller is
 * responsible for separately handling the vehicle if needed.
 */
const deleteMaintenance = async (maintenanceId) => {
  const record = await findMaintenanceOrThrow(maintenanceId);

  if (record.status !== MAINTENANCE_STATUS.OPEN) {
    throw createError(`Cannot delete a maintenance record with status '${record.status}'`, 409);
  }

  await record.deleteOne();
  return { message: 'Maintenance record deleted successfully' };
};

/**
 * Closes an Open maintenance record:
 * - Maintenance status -> Closed, endDate set to now.
 * - Vehicle status -> Available, UNLESS vehicle is Retired
 *   (a retired vehicle stays Retired regardless of maintenance state).
 */
const closeMaintenance = async (maintenanceId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const record = await findMaintenanceOrThrow(maintenanceId, session);

    if (record.status !== MAINTENANCE_STATUS.OPEN) {
      throw createError(`Only Open maintenance records can be closed (current status: '${record.status}')`, 409);
    }

    const vehicle = await findVehicleOrThrow(record.vehicle, session);

    record.status = MAINTENANCE_STATUS.CLOSED;
    record.endDate = new Date();
    await record.save({ session });

    if (vehicle.status !== 'Retired') {
      vehicle.status = 'Available';
      await vehicle.save({ session });
    }

    await session.commitTransaction();
    return record;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  closeMaintenance,
};
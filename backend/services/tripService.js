const mongoose = require('mongoose');
const Trip = require('../models/Trip');
const Maintenance = require('../models/Maintenance');
const Vehicle = require('../models/Vehicle'); // Member 2's model — confirm field names
const Driver = require('../models/Driver');   // Member 2's model — confirm field names

const { TRIP_STATUS } = Trip;
const { MAINTENANCE_STATUS } = Maintenance;

/**
 * Small helper to throw an error with an HTTP status code attached,
 * so errorMiddleware.js can read err.statusCode directly.
 */
const createError = (message, statusCode = 400) => {
  const error = new Error(message);
  error.statusCode = statusCode;
  return error;
};

/* ============================================================
   INTERNAL HELPERS (not exported — reused across service methods)
   ============================================================ */

const findVehicleOrThrow = async (vehicleId, session = null) => {
  const vehicle = await Vehicle.findById(vehicleId).session(session);
  if (!vehicle) throw createError('Vehicle not found', 404);
  return vehicle;
};

const findDriverOrThrow = async (driverId, session = null) => {
  const driver = await Driver.findById(driverId).session(session);
  if (!driver) throw createError('Driver not found', 404);
  return driver;
};

const findTripOrThrow = async (tripId, session = null) => {
  const trip = await Trip.findById(tripId).session(session);
  if (!trip) throw createError('Trip not found', 404);
  return trip;
};

/**
 * Checks the vehicle has no OPEN maintenance record.
 * Required by: "Vehicles currently in maintenance must never
 * appear in Trip dispatch selection."
 */
const ensureNoOpenMaintenance = async (vehicleId, session = null) => {
  const openRecord = await Maintenance.findOne({
    vehicle: vehicleId,
    status: MAINTENANCE_STATUS.OPEN,
  }).session(session);

  if (openRecord) {
    throw createError('Vehicle currently has an open maintenance record', 409);
  }
};

/**
 * Runs every pre-dispatch business rule, in the order specified
 * in the requirements. Throws on the first failed rule.
 */
const validateDispatchEligibility = (vehicle, driver, cargoWeight) => {
  if (vehicle.status === 'In Shop') {
    throw createError('Vehicle is currently in shop', 409);
  }

  if (vehicle.status === 'Retired') {
    throw createError('Vehicle is retired and cannot be dispatched', 409);
  }

  if (vehicle.status !== 'Available') {
    throw createError(`Vehicle is not available (current status: ${vehicle.status})`, 409);
  }

  if (driver.status !== 'Available') {
    throw createError(`Driver is not available (current status: ${driver.status})`, 409);
  }

  if (driver.licenseExpiry && new Date(driver.licenseExpiry) < new Date()) {
    throw createError('Driver license has expired', 409);
  }

  if (cargoWeight > vehicle.maxCapacity) {
    throw createError(
      `Cargo weight (${cargoWeight}) exceeds vehicle maximum capacity (${vehicle.maxCapacity})`,
      400
    );
  }
};

/* ============================================================
   EXPORTED SERVICE FUNCTIONS
   ============================================================ */

/**
 * Creates a new trip in Draft status.
 * Only checks that the referenced Vehicle and Driver exist —
 * full availability rules are enforced at dispatch time, not creation.
 */
const createTrip = async (tripData) => {
  const { source, destination, vehicle, driver, cargoWeight, plannedDistance } = tripData;

  // Existence checks only — a Draft trip is a plan, not a commitment
  await findVehicleOrThrow(vehicle);
  await findDriverOrThrow(driver);

  const trip = await Trip.create({
    source,
    destination,
    vehicle,
    driver,
    cargoWeight,
    plannedDistance,
    status: TRIP_STATUS.DRAFT,
  });

  return trip;
};

/**
 * Returns all trips, with optional filtering by status/vehicle/driver
 * and pagination — supports the "Search / Filters" requirement on
 * the frontend Trips page.
 */
const getAllTrips = async (queryParams = {}) => {
  const { status, vehicle, driver, page = 1, limit = 20 } = queryParams;

  const filter = {};
  if (status) filter.status = status;
  if (vehicle) filter.vehicle = vehicle;
  if (driver) filter.driver = driver;

  const skip = (Number(page) - 1) * Number(limit);

  const [trips, total] = await Promise.all([
    Trip.find(filter)
      .populate('vehicle', 'registrationNumber status maxCapacity')
      .populate('driver', 'name status licenseExpiry')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit)),
    Trip.countDocuments(filter),
  ]);

  return {
    trips,
    pagination: {
      total,
      page: Number(page),
      limit: Number(limit),
      totalPages: Math.ceil(total / Number(limit)),
    },
  };
};

const getTripById = async (tripId) => {
  const trip = await Trip.findById(tripId)
    .populate('vehicle', 'registrationNumber status maxCapacity')
    .populate('driver', 'name status licenseExpiry');

  if (!trip) throw createError('Trip not found', 404);
  return trip;
};

/**
 * Updates editable trip fields. Only allowed while a trip is in Draft —
 * a Dispatched/Completed/Cancelled trip is a historical record and
 * must go through dispatchTrip/completeTrip/cancelTrip instead.
 * `status` and `completedAt` are stripped from the payload so this
 * method can never be used to bypass the dedicated transition functions.
 */
const updateTrip = async (tripId, updates) => {
  const trip = await findTripOrThrow(tripId);

  if (trip.status !== TRIP_STATUS.DRAFT) {
    throw createError(`Cannot edit a trip with status '${trip.status}'`, 409);
  }

  const { status, completedAt, ...safeUpdates } = updates;

  const allowedFields = ['source', 'destination', 'vehicle', 'driver', 'cargoWeight', 'plannedDistance'];
  Object.keys(safeUpdates).forEach((key) => {
    if (allowedFields.includes(key)) {
      trip[key] = safeUpdates[key];
    }
  });

  await trip.save(); // triggers schema validators (e.g. min values)
  return trip;
};

/**
 * Deletes a trip. Only Draft trips can be deleted — Dispatched,
 * Completed, or Cancelled trips are operational history and must
 * be preserved.
 */
const deleteTrip = async (tripId) => {
  const trip = await findTripOrThrow(tripId);

  if (trip.status !== TRIP_STATUS.DRAFT) {
    throw createError(`Cannot delete a trip with status '${trip.status}'`, 409);
  }

  await trip.deleteOne();
  return { message: 'Trip deleted successfully' };
};

/**
 * Dispatches a Draft trip:
 * - Validates every business rule.
 * - Trip -> Dispatched
 * - Vehicle -> On Trip
 * - Driver -> On Trip
 * Runs inside a transaction so Trip/Vehicle/Driver stay consistent
 * even if one write fails partway through.
 */
const dispatchTrip = async (tripId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const trip = await findTripOrThrow(tripId, session);

    if (trip.status !== TRIP_STATUS.DRAFT) {
      throw createError(`Only Draft trips can be dispatched (current status: '${trip.status}')`, 409);
    }

    const vehicle = await findVehicleOrThrow(trip.vehicle, session);
    const driver = await findDriverOrThrow(trip.driver, session);

    validateDispatchEligibility(vehicle, driver, trip.cargoWeight);
    await ensureNoOpenMaintenance(vehicle._id, session);

    trip.status = TRIP_STATUS.DISPATCHED;
    vehicle.status = 'On Trip';
    driver.status = 'On Trip';

    await trip.save({ session });
    await vehicle.save({ session });
    await driver.save({ session });

    await session.commitTransaction();
    return trip;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Completes a Dispatched trip:
 * - Trip -> Completed, completedAt set
 * - Vehicle -> Available
 * - Driver -> Available
 */
const completeTrip = async (tripId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const trip = await findTripOrThrow(tripId, session);

    if (trip.status !== TRIP_STATUS.DISPATCHED) {
      throw createError(`Only Dispatched trips can be completed (current status: '${trip.status}')`, 409);
    }

    const vehicle = await findVehicleOrThrow(trip.vehicle, session);
    const driver = await findDriverOrThrow(trip.driver, session);

    trip.status = TRIP_STATUS.COMPLETED;
    trip.completedAt = new Date();
    vehicle.status = 'Available';
    driver.status = 'Available';

    await trip.save({ session });
    await vehicle.save({ session });
    await driver.save({ session });

    await session.commitTransaction();
    return trip;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

/**
 * Cancels a trip:
 * - Trip -> Cancelled
 * - If the trip was Dispatched (i.e. Vehicle/Driver were already
 *   flipped to "On Trip"), restore both to Available.
 * - If the trip was still Draft, nothing to restore — Vehicle/Driver
 *   status was never changed in the first place.
 * - Completed/already-Cancelled trips cannot be cancelled.
 */
const cancelTrip = async (tripId) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();

    const trip = await findTripOrThrow(tripId, session);

    if (trip.status === TRIP_STATUS.COMPLETED) {
      throw createError('Cannot cancel a trip that is already Completed', 409);
    }
    if (trip.status === TRIP_STATUS.CANCELLED) {
      throw createError('Trip is already Cancelled', 409);
    }

    const wasDispatched = trip.status === TRIP_STATUS.DISPATCHED;

    trip.status = TRIP_STATUS.CANCELLED;
    await trip.save({ session });

    if (wasDispatched) {
      const vehicle = await findVehicleOrThrow(trip.vehicle, session);
      const driver = await findDriverOrThrow(trip.driver, session);

      vehicle.status = 'Available';
      driver.status = 'Available';

      await vehicle.save({ session });
      await driver.save({ session });
    }

    await session.commitTransaction();
    return trip;
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
};

module.exports = {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
};
const tripService = require('../services/tripService');

/**
 * @route   POST /api/trips
 * @desc    Create a new trip (status: Draft)
 */
const createTrip = async (req, res, next) => {
  try {
    const trip = await tripService.createTrip(req.body);
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/trips
 * @desc    Get all trips (supports ?status=&vehicle=&driver=&page=&limit=)
 */
const getAllTrips = async (req, res, next) => {
  try {
    const result = await tripService.getAllTrips(req.query);
    res.status(200).json({
      success: true,
      message: 'Trips fetched successfully',
      data: result.trips,
      pagination: result.pagination,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   GET /api/trips/:id
 * @desc    Get a single trip by ID
 */
const getTripById = async (req, res, next) => {
  try {
    const trip = await tripService.getTripById(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Trip fetched successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PUT /api/trips/:id
 * @desc    Update a Draft trip
 */
const updateTrip = async (req, res, next) => {
  try {
    const trip = await tripService.updateTrip(req.params.id, req.body);
    res.status(200).json({
      success: true,
      message: 'Trip updated successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   DELETE /api/trips/:id
 * @desc    Delete a Draft trip
 */
const deleteTrip = async (req, res, next) => {
  try {
    const result = await tripService.deleteTrip(req.params.id);
    res.status(200).json({
      success: true,
      message: result.message,
      data: null,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/dispatch
 * @desc    Dispatch a Draft trip (runs all eligibility checks)
 */
const dispatchTrip = async (req, res, next) => {
  try {
    const trip = await tripService.dispatchTrip(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Trip dispatched successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/complete
 * @desc    Complete a Dispatched trip
 */
const completeTrip = async (req, res, next) => {
  try {
    const trip = await tripService.completeTrip(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Trip completed successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @route   PATCH /api/trips/:id/cancel
 * @desc    Cancel a Draft or Dispatched trip
 */
const cancelTrip = async (req, res, next) => {
  try {
    const trip = await tripService.cancelTrip(req.params.id);
    res.status(200).json({
      success: true,
      message: 'Trip cancelled successfully',
      data: trip,
    });
  } catch (error) {
    next(error);
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
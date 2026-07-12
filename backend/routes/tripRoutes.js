const express = require('express');
const router = express.Router();

const {
  createTrip,
  getAllTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  dispatchTrip,
  completeTrip,
  cancelTrip,
} = require('../controllers/tripController');

// Base collection routes
router.route('/')
  .get(getAllTrips)
  .post(createTrip);

// Single-resource routes
router.route('/:id')
  .get(getTripById)
  .put(updateTrip)
  .delete(deleteTrip);

// Trip lifecycle transition routes (state-changing actions, not full updates)
router.patch('/:id/dispatch', dispatchTrip);
router.patch('/:id/complete', completeTrip);
router.patch('/:id/cancel', cancelTrip);

module.exports = router;
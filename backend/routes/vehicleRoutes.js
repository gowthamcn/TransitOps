const express = require('express');
const vehicleController = require('../controllers/vehicleController');
const router = express.Router();

// GET /api/vehicles - Get all vehicles with optional filters
router.get('/', vehicleController.getAllVehicles);

// GET /api/vehicles/available - Get only available vehicles (for trip dispatch)
router.get('/available', vehicleController.getAvailableVehicles);

// GET /api/vehicles/:id - Get single vehicle
router.get('/:id', vehicleController.getVehicleById);

// POST /api/vehicles - Create new vehicle
router.post('/', vehicleController.createVehicle);

// PUT /api/vehicles/:id - Update vehicle
router.put('/:id', vehicleController.updateVehicle);

// PATCH /api/vehicles/:id/status - Update vehicle status (for trip/maintenance operations)
router.patch('/:id/status', vehicleController.updateVehicleStatus);

// DELETE /api/vehicles/:id - Delete vehicle
router.delete('/:id', vehicleController.deleteVehicle);

module.exports = router;

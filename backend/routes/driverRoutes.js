const express = require('express');
const driverController = require('../controllers/driverController');
const router = express.Router();

// GET /api/drivers - Get all drivers with optional filters
router.get('/', driverController.getAllDrivers);

// GET /api/drivers/available - Get only available drivers for trip dispatch
router.get('/available', driverController.getAvailableDrivers);

// GET /api/drivers/expired - Get drivers with expired licenses
router.get('/expired', driverController.getExpiredDrivers);

// GET /api/drivers/:id - Get single driver
router.get('/:id', driverController.getDriverById);

// POST /api/drivers - Create new driver
router.post('/', driverController.createDriver);

// PUT /api/drivers/:id - Update driver
router.put('/:id', driverController.updateDriver);

// PATCH /api/drivers/:id/status - Update driver status (for trip operations)
router.patch('/:id/status', driverController.updateDriverStatus);

// DELETE /api/drivers/:id - Delete driver
router.delete('/:id', driverController.deleteDriver);

module.exports = router;

const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicleController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Vehicle CRUD routes
router
  .route('/')
  .get(vehicleController.getVehicles)
  .post(authorize('admin', 'manager'), vehicleController.createVehicle);

router
  .route('/:id')
  .get(vehicleController.getVehicleById)
  .put(authorize('admin', 'manager'), vehicleController.updateVehicle)
  .delete(authorize('admin'), vehicleController.deleteVehicle);

// Vehicle assignment routes
router
  .route('/:id/assign-driver')
  .put(authorize('admin', 'manager'), vehicleController.assignDriver);

router
  .route('/:id/unassign-driver')
  .put(authorize('admin', 'manager'), vehicleController.unassignDriver);

// Vehicle mileage route
router
  .route('/:id/mileage')
  .put(authorize('admin', 'manager'), vehicleController.updateMileage);

// Utility routes
router.get('/stats', vehicleController.getVehicleStats);
router.get('/available', vehicleController.getAvailableVehicles);
router.get('/search', vehicleController.searchVehicles);
router.get('/status/:status', vehicleController.getVehiclesByStatus);

module.exports = router;

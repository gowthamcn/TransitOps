const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driverController');
const { protect, authorize } = require('../middlewares/authMiddleware');

// All routes are protected
router.use(protect);

// Driver CRUD routes
router
  .route('/')
  .get(driverController.getDrivers)
  .post(authorize('admin', 'manager'), driverController.createDriver);

router
  .route('/:id')
  .get(driverController.getDriverById)
  .put(authorize('admin', 'manager'), driverController.updateDriver)
  .delete(authorize('admin'), driverController.deleteDriver);

// Driver assignment routes
router
  .route('/:id/assign-vehicle')
  .put(authorize('admin', 'manager'), driverController.assignVehicle);

router
  .route('/:id/unassign-vehicle')
  .put(authorize('admin', 'manager'), driverController.unassignVehicle);

// Driver status route
router
  .route('/:id/status')
  .put(authorize('admin', 'manager'), driverController.updateStatus);

// Document routes
router
  .route('/:id/documents')
  .post(authorize('admin', 'manager'), driverController.addDocument);

router
  .route('/:id/documents/:documentId')
  .delete(authorize('admin', 'manager'), driverController.removeDocument);

// Utility routes
router.get('/stats', driverController.getDriverStats);
router.get('/available', driverController.getAvailableDrivers);
router.get('/search', driverController.searchDrivers);
router.get('/status/:status', driverController.getDriversByStatus);
router.get('/expired-licenses', driverController.getDriversWithExpiredLicenses);
router.get('/expiring-licenses', driverController.getDriversWithExpiringLicenses);

module.exports = router;

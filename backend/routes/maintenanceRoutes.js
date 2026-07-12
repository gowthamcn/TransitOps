const express = require('express');
const router = express.Router();

const {
  createMaintenance,
  getAllMaintenance,
  getMaintenanceById,
  updateMaintenance,
  deleteMaintenance,
  closeMaintenance,
} = require('../controllers/maintenanceController');

// Base collection routes
router.route('/')
  .get(getAllMaintenance)
  .post(createMaintenance);

// Single-resource routes
router.route('/:id')
  .get(getMaintenanceById)
  .put(updateMaintenance)
  .delete(deleteMaintenance);

// Maintenance lifecycle transition route (state-changing action, not full update)
router.patch('/:id/close', closeMaintenance);

module.exports = router;
const getDashboardStats = async (filters) => {
  // Temporary data for Hackathon Demo
  // Later this will come from MongoDB
const { vehicleType, status, region } = filters;
  return {
    activeVehicles: 124,
    availableVehicles: 108,
    maintenanceVehicles: 16,
    activeTrips: 42,
    pendingTrips: 11,
    driversOnDuty: 57,
    fleetUtilization: 87,

    filters: {
      vehicleTypes: [
        "Truck",
        "Van",
        "Bus"
      ],

      status: [
        "Available",
        "In Transit",
        "Maintenance"
      ],

      regions: [
        "North",
        "South",
        "East",
        "West"
      ]
    }
  };
};

module.exports = {
  getDashboardStats,
};
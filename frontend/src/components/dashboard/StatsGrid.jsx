import { useEffect, useState } from "react";
import {
  Truck,
  CheckCircle,
  Wrench,
  Route,
  Clock3,
  Users,
  BarChart3,
} from "lucide-react";

import DashboardCard from "./DashboardCard";
import { getDashboardStats } from "../../services/dashboardService";

const StatsGrid = ({ filters }) => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    console.log("Filters:", filters);
    const loadStats = async () => {
      try {
        const data = await getDashboardStats(filters);
        setStats(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, [filters]);

  if (!stats) {
    return (
      <div className="text-center text-slate-400 py-10">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

      <DashboardCard
        title="Active Vehicles"
        value={stats.activeVehicles}
        color="bg-blue-500"
        icon={<Truck className="text-white" />}
      />

      <DashboardCard
        title="Available Vehicles"
        value={stats.availableVehicles}
        color="bg-green-500"
        icon={<CheckCircle className="text-white" />}
      />

      <DashboardCard
        title="Vehicles in Maintenance"
        value={stats.maintenanceVehicles}
        color="bg-yellow-500"
        icon={<Wrench className="text-white" />}
      />

      <DashboardCard
        title="Active Trips"
        value={stats.activeTrips}
        color="bg-cyan-500"
        icon={<Route className="text-white" />}
      />

      <DashboardCard
        title="Pending Trips"
        value={stats.pendingTrips}
        color="bg-red-500"
        icon={<Clock3 className="text-white" />}
      />

      <DashboardCard
        title="Drivers On Duty"
        value={stats.driversOnDuty}
        color="bg-indigo-500"
        icon={<Users className="text-white" />}
      />

      <DashboardCard
        title="Fleet Utilization"
        value={`${stats.fleetUtilization}%`}
        color="bg-purple-500"
        icon={<BarChart3 className="text-white" />}
      />

    </div>
  );
};

export default StatsGrid;
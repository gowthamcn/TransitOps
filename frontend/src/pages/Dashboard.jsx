import { useState } from "react";

import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import DashboardFilters from "../components/dashboard/DashboardFilters";

const Dashboard = () => {

  const [filters, setFilters] = useState({
    vehicleType: "",
    status: "",
    region: "",
  });

  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <DashboardHeader />

      <StatsGrid filters={filters} />

      <DashboardFilters
        filters={filters}
        setFilters={setFilters}
      />

    </div>
  );
};

export default Dashboard;
import DashboardHeader from "../components/dashboard/DashboardHeader";
import StatsGrid from "../components/dashboard/StatsGrid";
import DashboardFilters from "../components/dashboard/DashboardFilters";

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-slate-950 p-8">

      <DashboardHeader />

      <StatsGrid />

      <DashboardFilters />

    </div>
  );
};

export default Dashboard;
import { LogOut, UserCircle2 } from "lucide-react";
import { useAuthContext } from "../../context/AuthContext";

const DashboardHeader = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="flex justify-between items-center mb-8">

      <div>

        <h1 className="text-4xl font-bold text-white">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back, {user?.name}
        </p>

      </div>

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-2 bg-slate-800 px-4 py-2 rounded-xl">

          <UserCircle2 size={22} />

          <div>

            <p className="text-white text-sm font-semibold">
              {user?.name}
            </p>

            <p className="text-slate-400 text-xs uppercase">
              {user?.role}
            </p>

          </div>

        </div>

        <button
          onClick={logout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl text-white transition"
        >
          <LogOut size={18} />
        </button>

      </div>

    </div>
  );
};

export default DashboardHeader;
import { useAuthContext } from "../context/AuthContext";

const Dashboard = () => {
  const { user, logout } = useAuthContext();

  return (
    <div className="min-h-screen bg-slate-900 text-white p-10">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-4xl font-bold">
            Welcome {user?.name}
          </h1>

          <p className="text-slate-400 mt-2">
            Role : {user?.role}
          </p>

        </div>

        <button
          onClick={logout}
          className="bg-red-500 px-5 py-2 rounded-lg"
        >
          Logout
        </button>

      </div>

    </div>
  );
};

export default Dashboard;
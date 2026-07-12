import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const Login = () => {
  const { login, loading, error } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await login(formData.email, formData.password);

    if (result) {
        navigate("/dashboard");
    }
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800 flex items-center justify-center px-6">

      <div className="w-full max-w-5xl bg-slate-900/70 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden grid md:grid-cols-2">

        {/* Left Side */}

        <div className="hidden md:flex flex-col justify-center p-14 text-white bg-gradient-to-br from-cyan-600 to-blue-700">

          <h1 className="text-5xl font-bold">
            TransitOps
          </h1>

          <p className="mt-6 text-lg text-cyan-100 leading-8">
            Smart Fleet Management System
          </p>

          <div className="mt-12 space-y-4 text-cyan-100">

            <p>🚚 Fleet Tracking</p>

            <p>📍 Live Trip Monitoring</p>

            <p>🛠 Maintenance Scheduling</p>

            <p>⛽ Fuel Analytics</p>

          </div>

        </div>

        {/* Right Side */}

        <div className="p-10 md:p-14 bg-slate-900 text-white">

          <h2 className="text-3xl font-bold">
            Welcome Back
          </h2>

          <p className="text-slate-400 mt-2">
            Login to continue
          </p>

          <form
            onSubmit={handleSubmit}
            className="space-y-6 mt-10"
          >

            <div>

              <label className="block mb-2 text-sm">
                Email
              </label>

              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="hari@gmail.com"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />

            </div>

            <div>

              <label className="block mb-2 text-sm">
                Password
              </label>

              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-cyan-500"
                required
              />

            </div>

            {error && (
              <p className="text-red-400 text-sm">
                {error}
              </p>
            )}

            <button
              disabled={loading}
              className="w-full py-3 rounded-xl bg-cyan-500 hover:bg-cyan-600 transition text-white font-semibold"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

        </div>

      </div>

    </div>
  );
};

export default Login;
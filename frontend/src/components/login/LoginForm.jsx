import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import useAuth from "../../hooks/useAuth";

const LoginForm = () => {
  const navigate = useNavigate();
  const { login, loading, error } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

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

    const result = await login(
      formData.email,
      formData.password,
      rememberMe
    );

    if (result) {
      toast.success(`Welcome back, ${result.data.user.name}!`);
      navigate("/dashboard");
    }
  };

  return (
    <div className="p-12 bg-slate-900 text-white flex flex-col justify-center">

      <h2 className="text-4xl font-bold">Welcome Back</h2>

      <p className="text-slate-400 mt-2">
        Login to your TransitOps account
      </p>

      <form onSubmit={handleSubmit} className="mt-10 space-y-6">

        <div>
          <label className="block mb-2">Email</label>

          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="hari@gmail.com"
            className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 focus:ring-2 focus:ring-cyan-500 outline-none"
            required
          />
        </div>

        <div>

          <label className="block mb-2">
            Password
          </label>

          <div className="relative">

            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="********"
              className="w-full rounded-xl bg-slate-800 border border-slate-700 px-4 py-3 pr-12 focus:ring-2 focus:ring-cyan-500 outline-none"
              required
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>

          </div>

        </div>

        <div className="flex justify-between items-center">

          <label className="flex items-center gap-2 text-sm">

            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              className="accent-cyan-500"
            />

            Remember Me

          </label>

          <button
            type="button"
            className="text-cyan-400 hover:underline"
          >
            Forgot Password?
          </button>

        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500 rounded-xl p-3 text-red-400">
            {error}
          </div>
        )}

        <button
          disabled={loading}
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition rounded-xl py-3 font-semibold flex justify-center items-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Signing In...
            </>
          ) : (
            "Sign In"
          )}
        </button>

      </form>

    </div>
  );
};

export default LoginForm;
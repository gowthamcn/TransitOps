import { useState } from "react";
import { loginUser } from "../services/authService";
import { useAuthContext } from "../context/AuthContext";

const useAuth = () => {
  const { login: saveUser } = useAuthContext();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const login = async (email, password, rememberMe = true) => {
    setLoading(true);
    setError("");

    try {
      const response = await loginUser({
        email,
        password,
      });

      if (!response.success) {
        setError(response.message);
        return null;
      }

      saveUser(
  response.data.user,
  response.data.token,
  rememberMe
);

      return response;
    } catch (err) {
      setError("Unable to login");
      return null;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return {
    login,
    logout,
    loading,
    error,
  };
};

export default useAuth;
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./routes/ProtectedRoute";

import { useAuthContext } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuthContext();

  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={isAuthenticated ? <Dashboard /> : <Login />}
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

      </Routes>

    </BrowserRouter>
  );
}

export default App;
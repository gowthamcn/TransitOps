import { Routes, Route, Link, useLocation } from "react-router-dom";

import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import Drivers from "./pages/Drivers";
import Vehicles from "./pages/Vehicles";

import ProtectedRoute from "./routes/ProtectedRoute";
import { useAuthContext } from "./context/AuthContext";

function App() {
  const { isAuthenticated } = useAuthContext();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Login />;
  }

  const navLinks = [
    { path: "/dashboard", label: "Dashboard" },
    { path: "/vehicles", label: "Vehicles" },
    { path: "/drivers", label: "Drivers" },
    { path: "/reports", label: "Reports" },
  ];

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0f172a",
        color: "#e2e8f0",
      }}
    >
      <nav
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          padding: "16px 32px",
          background: "#1e293b",
          borderBottom: "1px solid #334155",
        }}
      >
        <span
          style={{
            fontWeight: 700,
            fontSize: "1.2rem",
            color: "#3b82f6",
          }}
        >
          TransitOps
        </span>

        {navLinks.map(({ path, label }) => (
          <Link
            key={path}
            to={path}
            style={{
              color:
                location.pathname === path
                  ? "#3b82f6"
                  : "#94a3b8",
              textDecoration: "none",
              fontWeight:
                location.pathname === path ? 600 : 400,
            }}
          >
            {label}
          </Link>
        ))}
      </nav>

      <main style={{ padding: "24px 32px" }}>
        <Routes>
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vehicles"
            element={
              <ProtectedRoute>
                <Vehicles />
              </ProtectedRoute>
            }
          />

          <Route
            path="/drivers"
            element={
              <ProtectedRoute>
                <Drivers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/reports"
            element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;
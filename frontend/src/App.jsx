import { BrowserRouter, Routes, Route, NavLink, Navigate } from 'react-router-dom';
import Trips from './pages/Trips';
import Maintenance from './pages/Maintenance';

function App() {
  return (
    <BrowserRouter>
      <div className="app-shell">
        <nav className="app-nav">
          <h1 className="app-title">TransitOps</h1>
          <div className="app-nav-links">
            <NavLink
              to="/trips"
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              Trips
            </NavLink>
            <NavLink
              to="/maintenance"
              className={({ isActive }) => (isActive ? 'nav-link nav-link-active' : 'nav-link')}
            >
              Maintenance
            </NavLink>
          </div>
        </nav>

        <main className="app-content">
          <Routes>
            <Route path="/" element={<Navigate to="/trips" replace />} />
            <Route path="/trips" element={<Trips />} />
            <Route path="/maintenance" element={<Maintenance />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
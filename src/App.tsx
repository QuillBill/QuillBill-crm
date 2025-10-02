import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { 
  FiHome, 
  FiBarChart3, 
  FiUsers, 
  FiTarget, 
  FiSettings,
  FiSun,
  FiMoon,
  FiChevronLeft,
  FiChevronRight
} from "react-icons/fi";
import Home from "./pages/Home";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Users from "./pages/Users";
import Leads from "./pages/Leads";
import NotFound from "./pages/NotFound";
import "./App.css";

function App() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <div className={`dashboard ${darkMode ? "dark" : ""}`}>
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
        <div className="logo">
          <span>⚡</span>
          {!sidebarCollapsed && <span>Enterprise CRM</span>}
        </div>
        <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
        <nav className="sidebar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            <FiHome className="icon" />
            {!sidebarCollapsed && <span>Home</span>}
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}>
            <FiBarChart3 className="icon" />
            {!sidebarCollapsed && <span>Analytics</span>}
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
            <FiUsers className="icon" />
            {!sidebarCollapsed && <span>Users</span>}
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => isActive ? "active" : ""}>
            <FiTarget className="icon" />
            {!sidebarCollapsed && <span>Leads</span>}
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
            <FiSettings className="icon" />
            {!sidebarCollapsed && <span>Settings</span>}
          </NavLink>
        </nav>
        <button className="darkmode-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? <FiSun /> : <FiMoon />}
          {!sidebarCollapsed && <span>{darkMode ? " Light Mode" : " Dark Mode"}</span>}
        </button>
      </aside>

      {/* Main content */}
      <main className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/users" element={<Users />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
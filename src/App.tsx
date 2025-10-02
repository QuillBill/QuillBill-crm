import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
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
        <div className="logo">⚡ SaaS CRM</div>
        <button className="collapse-btn" onClick={() => setSidebarCollapsed(!sidebarCollapsed)}>
          {sidebarCollapsed ? "▶" : "◀"}
        </button>
        <nav className="sidebar-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">🏠</span>
            {!sidebarCollapsed && <span>Home</span>}
          </NavLink>
          <NavLink to="/analytics" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">📊</span>
            {!sidebarCollapsed && <span>Analytics</span>}
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">👥</span>
            {!sidebarCollapsed && <span>Users</span>}
          </NavLink>
          <NavLink to="/leads" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">🎯</span>
            {!sidebarCollapsed && <span>Leads</span>}
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => isActive ? "active" : ""}>
            <span className="icon">⚙️</span>
            {!sidebarCollapsed && <span>Settings</span>}
          </NavLink>
        </nav>
        <button className="darkmode-btn" onClick={() => setDarkMode(!darkMode)}>
          {darkMode ? "🌞" : "🌙"}
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
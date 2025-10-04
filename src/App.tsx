import React, { useState } from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { FiHome } from "react-icons/fi";
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
    <div>
      <h1>Hello Vite + React!</h1>
      <FiHome size={24} />
    </div>
  );
}

export default App;
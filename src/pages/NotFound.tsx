import React from "react";
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <Link to="/" style={{ 
        display: 'inline-block',
        padding: '1rem 2rem',
        background: '#4f46e5',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '8px',
        fontWeight: 'bold',
        transition: 'all 0.3s ease'
      }}>
        🏠 Go Back Home
      </Link>
      
      <div style={{ 
        marginTop: '3rem', 
        padding: '2rem', 
        background: 'rgba(79, 70, 229, 0.1)', 
        borderRadius: '12px',
        maxWidth: '500px',
        margin: '3rem auto 0'
      }}>
        <h3 style={{ marginBottom: '1rem', color: '#4f46e5' }}>Quick Navigation</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <Link to="/" style={{ color: '#4f46e5', textDecoration: 'none' }}>
            📊 Dashboard - View your overview
          </Link>
          <Link to="/analytics" style={{ color: '#4f46e5', textDecoration: 'none' }}>
            📈 Analytics - Check your metrics
          </Link>
          <Link to="/users" style={{ color: '#4f46e5', textDecoration: 'none' }}>
            👥 Users - Manage team members
          </Link>
          <Link to="/leads" style={{ color: '#4f46e5', textDecoration: 'none' }}>
            🎯 Leads - Track your pipeline
          </Link>
          <Link to="/settings" style={{ color: '#4f46e5', textDecoration: 'none' }}>
            ⚙️ Settings - Configure your system
          </Link>
        </div>
      </div>
    </div>
  );
}
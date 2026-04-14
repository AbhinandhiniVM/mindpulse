import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Heart, LogOut, Menu } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

function Navbar({ user }) {
  const location = useLocation();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <Heart className="logo-icon" />
          <span>MindPulse</span>
        </Link>

        <button
          className="menu-toggle"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <Menu size={24} />
        </button>

        <div className={`nav-menu ${menuOpen ? 'active' : ''}`}>
          <Link
            to="/"
            className={`nav-link ${isActive('/') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Dashboard
          </Link>
          <Link
            to="/sensor-dashboard"
            className={`nav-link ${isActive('/sensor-dashboard') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            🔴 Sensor Live
          </Link>
          <Link
            to="/input"
            className={`nav-link ${isActive('/input') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Input Data
          </Link>
          <Link
            to="/analytics"
            className={`nav-link ${isActive('/analytics') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Analytics
          </Link>
          <Link
            to="/settings"
            className={`nav-link ${isActive('/settings') ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            Settings
          </Link>
        </div>

        <div className="navbar-user">
          <span className="user-name">{user?.name || 'User'}</span>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <LogOut size={20} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

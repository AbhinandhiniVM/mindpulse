import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import DataInput from './pages/DataInput';
import Analytics from './pages/Analytics';
import SensorDashboard from './pages/SensorDashboard';
import Settings from './pages/Settings';
import './App.css';

function AppContent() {
  const { isAuthenticated, user, isLoading } = useAuth();
  const [showNavbar, setShowNavbar] = useState(false);

  useEffect(() => {
    setShowNavbar(isAuthenticated);
  }, [isAuthenticated]);

  if (isLoading) {
    return (
      <div className="loading-screen">
        <div className="loading-spinner">
          <div className="spinner-circle"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      {showNavbar && <Navbar user={user} />}
      <main className={`main-content ${showNavbar ? 'with-navbar' : ''}`}>
        <Routes>
          {/* Public Routes */}
          <Route path="/welcome" element={isAuthenticated ? <Navigate to="/" /> : <Welcome />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" /> : <Login />} />
          <Route path="/signup" element={isAuthenticated ? <Navigate to="/" /> : <Signup />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Dashboard user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/input"
            element={
              <ProtectedRoute>
                <DataInput user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/analytics"
            element={
              <ProtectedRoute>
                <Analytics user={user} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/sensor-dashboard"
            element={
              <ProtectedRoute>
                <SensorDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings user={user} />
              </ProtectedRoute>
            }
          />

          {/* Redirect to welcome if route not found */}
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/welcome"} />} />
        </Routes>
      </main>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;

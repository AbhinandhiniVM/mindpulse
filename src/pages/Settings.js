import React, { useState, useEffect } from 'react';
import { Save, LogOut } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import axiosInstance from '../api/axiosInstance';
import './Settings.css';

function Settings({ user, setUser }) {
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    theme: localStorage.getItem('theme') || 'dark',
    notifications: true,
    emailNotifications: true
  });
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await axiosInstance.get('/api/settings');
        setFormData(prev => ({
          ...prev,
          ...response.data
        }));
      } catch (error) {
        console.error('Error loading settings:', error);
      }
      setLoading(false);
    };
    
    loadSettings();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    try {
      const response = await axiosInstance.put('/api/settings', {
        name: formData.name,
        email: formData.email,
        theme: formData.theme,
        notifications: formData.notifications,
        emailNotifications: formData.emailNotifications
      });
      
      const updatedUser = {
        ...user,
        name: response.data.user.name,
        email: response.data.user.email
      };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      localStorage.setItem('theme', formData.theme);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error saving settings:', error);
      setMessage({ type: 'error', text: 'Failed to save settings' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (loading) {
    return <div className="loading-container">Loading settings...</div>;
  }

  return (
    <div className="settings">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your profile and preferences</p>
      </div>

      <div className="settings-container">
        {/* Profile Section */}
        <Card title="👤 Profile" className="settings-card">
          <form className="settings-form">
            {message && (
              <div className={`message message-${message.type}`}>
                {message.text}
              </div>
            )}

            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Your name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="form-input"
                placeholder="your@email.com"
              />
            </div>

            <Button
              variant="success"
              size="lg"
              onClick={handleSave}
              className="save-btn"
            >
              <Save size={20} />
              Save Changes
            </Button>
          </form>
        </Card>

        {/* Preferences Section */}
        <Card title="⚙️ Preferences" className="settings-card">
          <form className="settings-form">
            <div className="form-group">
              <label htmlFor="theme" className="form-label">
                Theme
              </label>
              <select
                id="theme"
                name="theme"
                value={formData.theme}
                onChange={handleChange}
                className="form-input form-select"
              >
                <option value="dark">Dark Mode</option>
                <option value="light">Light Mode</option>
                <option value="auto">Auto (System)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={formData.notifications}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Enable notifications</span>
              </label>
            </div>

            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="emailNotifications"
                  checked={formData.emailNotifications}
                  onChange={handleChange}
                  className="form-checkbox"
                />
                <span>Email notifications</span>
              </label>
            </div>
          </form>
        </Card>

        {/* About Section */}
        <Card title="ℹ️ About" className="settings-card">
          <div className="about-content">
            <div className="about-item">
              <h4>MindPulse</h4>
              <p className="version">Version 1.0.0</p>
              <p>
                An AI-powered mental health tracking application that uses deep learning
                to detect emotions from PPG sensor data (heart rate and oxygen levels).
              </p>
            </div>

            <div className="about-item">
              <h4>Features</h4>
              <ul className="feature-list">
                <li>Real-time emotion detection</li>
                <li>Heart rate and O₂ level monitoring</li>
                <li>Comprehensive analytics and insights</li>
                <li>Personalized mental health recommendations</li>
                <li>Secure data storage</li>
              </ul>
            </div>

            <div className="about-item">
              <h4>Supported Emotions</h4>
              <div className="emotion-badges">
                <span className="badge">😊 Happy</span>
                <span className="badge">😌 Relaxed</span>
                <span className="badge">😢 Sad</span>
                <span className="badge">😠 Angry</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Data Management Section */}
        <Card title="🗄️ Data Management" className="settings-card">
          <div className="data-management">
            <div className="management-item">
              <h4>Export Data</h4>
              <p>Download all your health records in JSON format</p>
              <Button variant="secondary" size="sm">
                Export JSON
              </Button>
            </div>

            <div className="management-item">
              <h4>Import Data</h4>
              <p>Import previously exported health records</p>
              <Button variant="secondary" size="sm">
                Import JSON
              </Button>
            </div>

            <div className="management-item danger">
              <h4>Delete All Data</h4>
              <p>Permanently remove all health records (cannot be undone)</p>
              <Button variant="danger" size="sm">
                Delete Data
              </Button>
            </div>
          </div>
        </Card>

        {/* Logout Section */}
        <Card title="🚪 Session" className="settings-card logout-card">
          <p className="logout-message">Sign out from your account</p>
          <Button
            variant="danger"
            size="lg"
            onClick={handleLogout}
            className="logout-btn"
          >
            <LogOut size={20} />
            Logout
          </Button>
        </Card>
      </div>
    </div>
  );
}

export default Settings;

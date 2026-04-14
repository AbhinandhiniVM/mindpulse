import React, { useState } from 'react';
import { Send, AlertCircle } from 'lucide-react';
import Card from '../components/Card';
import Button from '../components/Button';
import axiosInstance from '../api/axiosInstance';
import './DataInput.css';

function DataInput({ user }) {
  const [formData, setFormData] = useState({
    heartRate: '',
    o2Level: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.heartRate || !formData.o2Level) {
      setMessage({ type: 'error', text: 'Please fill in all required fields.' });
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post('/api/predict', {
        heartRate: parseFloat(formData.heartRate),
        o2Level: parseFloat(formData.o2Level),
        notes: formData.notes
      });

      setMessage({
        type: 'success',
        text: `Emotion detected: ${response.data.emotion} (${response.data.confidence}% confidence)`
      });
      
      // Reset form
      setFormData({ heartRate: '', o2Level: '', notes: '' });
    } catch (error) {
      console.error('Error submitting data:', error);
      setMessage({
        type: 'error',
        text: 'Error processing data. Please try again.'
      });
    } finally {
      setLoading(false);
    }

    // Clear message after 5 seconds
    setTimeout(() => setMessage(null), 5000);
  };

  return (
    <div className="data-input">
      <div className="page-header">
        <h1>Input Sensor Data</h1>
        <p>Connect your PPG sensor and input heart rate and O₂ levels for emotion detection</p>
      </div>

      <div className="input-container">
        <Card title="PPG Sensor Data" className="input-card">
          <form onSubmit={handleSubmit} className="form">
            {message && (
              <div className={`message message-${message.type}`}>
                <AlertCircle size={20} />
                <span>{message.text}</span>
              </div>
            )}

            <div className="form-group">
              <label htmlFor="heartRate" className="form-label">
                Heart Rate (bpm) *
              </label>
              <input
                type="number"
                id="heartRate"
                name="heartRate"
                value={formData.heartRate}
                onChange={handleChange}
                placeholder="e.g., 75"
                className="form-input"
                min="30"
                max="200"
                step="1"
                disabled={loading}
              />
              <p className="input-hint">Normal range: 60-100 bpm</p>
            </div>

            <div className="form-group">
              <label htmlFor="o2Level" className="form-label">
                Oxygen Level (%) *
              </label>
              <input
                type="number"
                id="o2Level"
                name="o2Level"
                value={formData.o2Level}
                onChange={handleChange}
                placeholder="e.g., 98"
                className="form-input"
                min="85"
                max="100"
                step="0.1"
                disabled={loading}
              />
              <p className="input-hint">Normal range: 95-100%</p>
            </div>

            <div className="form-group">
              <label htmlFor="notes" className="form-label">
                Additional Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                placeholder="What were you doing? Any specific situation?"
                className="form-input form-textarea"
                rows="4"
                disabled={loading}
              ></textarea>
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              disabled={loading}
              className="submit-btn"
            >
              <Send size={20} />
              {loading ? 'Processing...' : 'Analyze and Predict Emotion'}
            </Button>
          </form>
        </Card>

        {/* Calibration Guide */}
        <div className="calibration-guide">
          <h3>📊 How to Use Your PPG Sensor</h3>
          <ol className="guide-list">
            <li>Place the sensor on your fingertip (index or middle finger)</li>
            <li>Ensure the sensor is snug but not too tight</li>
            <li>Keep your hand still and steady for 15-30 seconds</li>
            <li>The sensor will measure your pulse and oxygen saturation</li>
            <li>Record the readings in the form above</li>
            <li>Our AI will analyze the data and detect your emotion</li>
          </ol>
        </div>

        {/* Emotion Reference */}
        <div className="emotion-reference">
          <h3>🧠 Emotion Reference</h3>
          <div className="reference-grid">
            <div className="reference-item">
              <span className="emoji">😊</span>
              <span className="emotion-label">Happy</span>
              <p>HR: 70-90, O₂: 98-100%</p>
            </div>
            <div className="reference-item">
              <span className="emoji">😌</span>
              <span className="emotion-label">Relaxed</span>
              <p>HR: 60-75, O₂: 97-100%</p>
            </div>
            <div className="reference-item">
              <span className="emoji">😢</span>
              <span className="emotion-label">Sad</span>
              <p>HR: 65-85, O₂: 96-99%</p>
            </div>
            <div className="reference-item">
              <span className="emoji">😠</span>
              <span className="emotion-label">Angry</span>
              <p>HR: 85-110, O₂: 95-99%</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DataInput;

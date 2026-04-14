import React, { useState, useEffect, useCallback } from 'react';
import { Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../components/Card';
import axiosInstance from '../api/axiosInstance';
import './SensorDashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function SensorDashboard() {
  const [sensorData, setSensorData] = useState([]);
  const [stats, setStats] = useState(null);
  const [emotionPrediction, setEmotionPrediction] = useState(null);
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const refreshInterval = 5000; // 5 seconds

  // Fetch latest sensor data
  const fetchSensorData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/sensor-data/latest?limit=50');
      setSensorData(response.data);

      if (response.data.length > 0) {
        // Get statistics
        const statsResponse = await axiosInstance.get('/api/sensor-data/stats');
        setStats(statsResponse.data);

        // Get emotion prediction
        const predictionResponse = await axiosInstance.post('/api/sensor-data/predict', {
          readings: response.data.slice(0, 10) // Use last 10 readings
        });
        setEmotionPrediction(predictionResponse.data);
        setRecommendations(predictionResponse.data.recommendations);
      }
    } catch (error) {
      console.error('Error fetching sensor data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Auto-refresh effect
  useEffect(() => {
    fetchSensorData();

    if (autoRefresh) {
      const interval = setInterval(fetchSensorData, refreshInterval);
      return () => clearInterval(interval);
    }
  }, [fetchSensorData, autoRefresh, refreshInterval]);

  if (loading) {
    return <div className="loading-container">Loading sensor data...</div>;
  }

  // Prepare chart data
  const recentBPM = sensorData
    .filter(r => r.bpm !== null)
    .slice(-20)
    .map(r => r.bpm);
  
  const recentSpO2 = sensorData
    .filter(r => r.spo2 !== null)
    .slice(-20)
    .map(r => r.spo2);

  const recentPPG = sensorData
    .filter(r => r.ppg !== null)
    .slice(-20)
    .map(r => r.ppg);

  const timeLabels = sensorData
    .slice(-20)
    .map((r, i) => `${i}m`);

  // BPM Chart
  const bpmChartData = {
    labels: timeLabels,
    datasets: [{
      label: 'Heart Rate (BPM)',
      data: recentBPM,
      borderColor: '#ef4444',
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#ef4444'
    }]
  };

  // SpO2 Chart
  const spo2ChartData = {
    labels: timeLabels,
    datasets: [{
      label: 'Oxygen Saturation (%)',
      data: recentSpO2,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#3b82f6'
    }]
  };

  // PPG Chart
  const ppgChartData = {
    labels: timeLabels,
    datasets: [{
      label: 'PPG Signal',
      data: recentPPG,
      borderColor: '#8b5cf6',
      backgroundColor: 'rgba(139, 92, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 3,
      pointBackgroundColor: '#8b5cf6'
    }]
  };

  // Emotion Distribution Pie Chart
  const emotionChartData = emotionPrediction ? {
    labels: Object.keys(emotionPrediction.vitals),
    datasets: [{
      label: 'Emotion Distribution',
      data: Object.values(emotionPrediction.allEmotions || {}),
      backgroundColor: [
        '#fbbf24', // Happy - Yellow
        '#60a5fa', // Sad - Blue
        '#f87171', // Angry - Red
        '#10b981'  // Relaxed - Green
      ],
      borderColor: [
        '#f59e0b',
        '#3b82f6',
        '#ef4444',
        '#059669'
      ],
      borderWidth: 2
    }]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        position: 'bottom'
      },
      tooltip: {
        mode: 'index',
        intersect: false
      }
    },
    scales: {
      y: {
        beginAtZero: false,
        ticks: {
          color: '#6b7280'
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        ticks: {
          color: '#6b7280'
        },
        grid: {
          display: false
        }
      }
    }
  };

  return (
    <div className="sensor-dashboard">
      <div className="dashboard-header">
        <h1>🔴 Real-Time Sensor Dashboard</h1>
        <div className="header-controls">
          <label className="refresh-toggle">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
            Auto-refresh
          </label>
          <button onClick={fetchSensorData} className="btn-refresh">
            🔄 Refresh Now
          </button>
        </div>
      </div>

      {/* Current Vitals */}
      {stats && (
        <section className="vitals-section">
          <h2>Current Vital Statistics</h2>
          <div className="vitals-grid">
            <Card className="vital-card" icon="❤️">
              <div className="vital-label">Average BPM</div>
              <div className="vital-value">{stats.averageBPM}</div>
              <div className="vital-unit">beats/min</div>
            </Card>
            <Card className="vital-card" icon="🫁">
              <div className="vital-label">Average SpO₂</div>
              <div className="vital-value">{stats.averageSpO2}%</div>
              <div className="vital-unit">oxygen level</div>
            </Card>
            <Card className="vital-card" icon="📊">
              <div className="vital-label">PPG Signal</div>
              <div className="vital-value">{stats.averagePPG}</div>
              <div className="vital-unit">avg pulse</div>
            </Card>
            <Card className="vital-card" icon="📈">
              <div className="vital-label">Total Readings</div>
              <div className="vital-value">{stats.totalReadings}</div>
              <div className="vital-unit">measurements</div>
            </Card>
          </div>
        </section>
      )}

      {/* Emotion Prediction */}
      {emotionPrediction && (
        <section className="emotion-prediction-section">
          <h2>🧠 AI Emotion Detection</h2>
          <div className="emotion-card">
            <div className="emotion-display">
              <div className="emotion-icon">
                {emotionPrediction.dominantEmotion === 'Happy' && '😊'}
                {emotionPrediction.dominantEmotion === 'Sad' && '😢'}
                {emotionPrediction.dominantEmotion === 'Angry' && '😠'}
                {emotionPrediction.dominantEmotion === 'Relaxed' && '😌'}
              </div>
              <div className="emotion-info">
                <h3>{emotionPrediction.dominantEmotion}</h3>
                <p className="confidence">
                  Confidence: {emotionPrediction.confidence.toFixed(1)}%
                </p>
              </div>
            </div>
            {emotionChartData && (
              <div className="emotion-chart">
                <Pie data={emotionChartData} options={{
                  ...chartOptions,
                  plugins: {
                    ...chartOptions.plugins,
                    legend: { position: 'right' }
                  }
                }} />
              </div>
            )}
          </div>
        </section>
      )}

      {/* Real-time Charts */}
      <section className="charts-section">
        <h2>Real-Time Sensor Trends</h2>
        
        <div className="charts-grid">
          <Card className="chart-card">
            <h3>Heart Rate (BPM)</h3>
            <Line data={bpmChartData} options={chartOptions} />
            <div className="chart-status">
              <span className="status-dot" style={{ backgroundColor: '#ef4444' }}></span>
              Normal Range: 60-100 BPM
            </div>
          </Card>

          <Card className="chart-card">
            <h3>Oxygen Saturation (SpO₂)</h3>
            <Line data={spo2ChartData} options={chartOptions} />
            <div className="chart-status">
              <span className="status-dot" style={{ backgroundColor: '#3b82f6' }}></span>
              Healthy: 95-100%
            </div>
          </Card>

          <Card className="chart-card">
            <h3>PPG Signal</h3>
            <Line data={ppgChartData} options={chartOptions} />
            <div className="chart-status">
              <span className="status-dot" style={{ backgroundColor: '#8b5cf6' }}></span>
              Signal Range: 300-1000
            </div>
          </Card>
        </div>
      </section>

      {/* Mental Health Recommendations */}
      {recommendations && (
        <section className="recommendations-section">
          <h2>💡 Personalized Wellness Recommendations</h2>

          {recommendations.alerts.length > 0 && (
            <div className="alerts">
              <h3>⚠️ Health Alerts</h3>
              {recommendations.alerts.map((alert, idx) => (
                <div key={idx} className="alert-item">
                  {alert}
                </div>
              ))}
            </div>
          )}

          <div className="suggestions-grid">
            <div className="suggestions">
              <h3>💬 Suggestions for You</h3>
              {recommendations.suggestions.map((suggestion, idx) => (
                <div key={idx} className="suggestion-item">
                  {suggestion}
                </div>
              ))}
            </div>

            <div className="resources">
              <h3>📚 Helpful Resources</h3>
              {recommendations.resources.map((resource, idx) => (
                <a
                  key={idx}
                  href={resource.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="resource-link"
                >
                  🔗 {resource.title}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Data Table */}
      {sensorData.length > 0 && (
        <section className="data-table-section">
          <h2>Recent Readings</h2>
          <div className="table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>PPG</th>
                  <th>BPM</th>
                  <th>SpO₂ (%)</th>
                </tr>
              </thead>
              <tbody>
                {sensorData.slice(-10).reverse().map((reading, idx) => (
                  <tr key={idx}>
                    <td>{new Date(reading.timestamp).toLocaleTimeString()}</td>
                    <td className="ppg-value">{reading.ppg || '—'}</td>
                    <td className="bpm-value">{reading.bpm || '—'}</td>
                    <td className="spo2-value">{reading.spo2 || '—'}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default SensorDashboard;

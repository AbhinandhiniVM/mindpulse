import React, { useState, useEffect, useCallback } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import Card from '../components/Card';
import axiosInstance from '../api/axiosInstance';
import './Analytics.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

function Analytics({ user }) {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [timeRange, setTimeRange] = useState('week');
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = useCallback(async () => {
    try {
      const response = await axiosInstance.get(`/api/analytics?range=${timeRange}`);
      setAnalyticsData(response.data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
      loadMockAnalytics();
    }
    setLoading(false);
  }, [timeRange]);

  useEffect(() => {
    fetchAnalytics();
  }, [fetchAnalytics]);

  const loadMockAnalytics = () => {
    setAnalyticsData({
      heartRateData: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [72, 75, 68, 80, 74, 70, 73]
      },
      o2Data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        values: [98, 97, 99, 96, 98, 97, 99]
      },
      emotionDistribution: {
        happy: 35,
        sad: 15,
        angry: 10,
        relaxed: 40
      },
      emotionTrend: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        happy: [5, 4, 6, 5, 5, 4, 6],
        sad: [2, 2, 1, 2, 3, 1, 2],
        angry: [1, 2, 1, 1, 2, 1, 1],
        relaxed: [5, 6, 5, 6, 4, 6, 5]
      }
    });
  };

  if (loading) {
    return <div className="loading-container">Loading analytics...</div>;
  }

  if (!analyticsData) {
    return <div className="error-container">No data available</div>;
  }

  const heartRateChartData = {
    labels: analyticsData.heartRateData.labels,
    datasets: [{
      label: 'Heart Rate (bpm)',
      data: analyticsData.heartRateData.values,
      borderColor: '#3b82f6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#3b82f6',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const o2ChartData = {
    labels: analyticsData.o2Data.labels,
    datasets: [{
      label: 'O₂ Level (%)',
      data: analyticsData.o2Data.values,
      borderColor: '#10b981',
      backgroundColor: 'rgba(16, 185, 129, 0.1)',
      borderWidth: 2,
      tension: 0.4,
      fill: true,
      pointRadius: 4,
      pointBackgroundColor: '#10b981',
      pointBorderColor: '#fff',
      pointBorderWidth: 2
    }]
  };

  const emotionPieData = {
    labels: ['Happy', 'Relaxed', 'Sad', 'Angry'],
    datasets: [{
      data: [
        analyticsData.emotionDistribution.happy,
        analyticsData.emotionDistribution.relaxed,
        analyticsData.emotionDistribution.sad,
        analyticsData.emotionDistribution.angry
      ],
      backgroundColor: ['#fbbf24', '#10b981', '#3b82f6', '#ef4444'],
      borderColor: ['#f59e0b', '#059669', '#1e40af', '#dc2626'],
      borderWidth: 2
    }]
  };

  const emotionTrendData = {
    labels: analyticsData.emotionTrend.labels,
    datasets: [
      {
        label: 'Happy',
        data: analyticsData.emotionTrend.happy,
        borderColor: '#fbbf24',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Relaxed',
        data: analyticsData.emotionTrend.relaxed,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Sad',
        data: analyticsData.emotionTrend.sad,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        tension: 0.4
      },
      {
        label: 'Angry',
        data: analyticsData.emotionTrend.angry,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: true,
        labels: {
          color: 'var(--text-secondary)',
          font: { size: 12 }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(15, 23, 42, 0.8)',
        titleColor: '#f1f5f9',
        bodyColor: '#cbd5e1'
      }
    },
    scales: {
      y: {
        ticks: { color: 'var(--text-secondary)' },
        grid: { color: 'rgba(71, 85, 105, 0.3)' }
      },
      x: {
        ticks: { color: 'var(--text-secondary)' },
        grid: { color: 'rgba(71, 85, 105, 0.3)' }
      }
    }
  };

  return (
    <div className="analytics">
      <div className="page-header">
        <h1>Analytics & Insights</h1>
        <p>Comprehensive analysis of your mental health data</p>
      </div>

      <div className="time-range-selector">
        <button
          className={`range-btn ${timeRange === 'week' ? 'active' : ''}`}
          onClick={() => setTimeRange('week')}
        >
          Week
        </button>
        <button
          className={`range-btn ${timeRange === 'month' ? 'active' : ''}`}
          onClick={() => setTimeRange('month')}
        >
          Month
        </button>
        <button
          className={`range-btn ${timeRange === 'year' ? 'active' : ''}`}
          onClick={() => setTimeRange('year')}
        >
          Year
        </button>
      </div>

      <div className="analytics-grid">
        <Card title="Heart Rate Trend" className="chart-card">
          <Line data={heartRateChartData} options={chartOptions} />
        </Card>

        <Card title="Oxygen Level Trend" className="chart-card">
          <Line data={o2ChartData} options={chartOptions} />
        </Card>

        <Card title="Emotion Distribution" className="chart-card">
          <Pie data={emotionPieData} options={{ ...chartOptions, responsive: true }} />
        </Card>

        <Card title="Emotion Frequency Over Time" className="chart-card full-width">
          <Line data={emotionTrendData} options={chartOptions} />
        </Card>
      </div>

      <div className="insights-section">
        <Card title="📊 Key Insights">
          <div className="insights-list">
            <div className="insight-item">
              <span className="insight-number">1</span>
              <div className="insight-content">
                <h4>Most Frequent Emotion</h4>
                <p>Your most detected emotion is <strong>Relaxed (40%)</strong>. Keep maintaining this positive state!</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-number">2</span>
              <div className="insight-content">
                <h4>Heart Rate Stability</h4>
                <p>Your average heart rate is <strong>72 bpm</strong>, indicating good cardiovascular health.</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-number">3</span>
              <div className="insight-content">
                <h4>Oxygen Levels</h4>
                <p>Consistently healthy O₂ levels at <strong>97.6%</strong> average - excellent!</p>
              </div>
            </div>
            <div className="insight-item">
              <span className="insight-number">4</span>
              <div className="insight-content">
                <h4>Emotional Balance</h4>
                <p>Your emotions are well-distributed. Continue practices that promote happiness and relaxation.</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default Analytics;

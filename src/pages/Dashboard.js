import React, { useState, useEffect, useCallback } from 'react';
import { Activity, Heart, Zap, TrendingUp } from 'lucide-react';
import Card from '../components/Card';
import EmotionCard from '../components/EmotionCard';
import axiosInstance from '../api/axiosInstance';
import './Dashboard.css';

function Dashboard({ user }) {
  const [latestRecord, setLatestRecord] = useState(null);
  const [stats, setStats] = useState({
    totalRecords: 0,
    averageHeartRate: 0,
    averageO2: 0,
    lastEmotionDetected: 'N/A'
  });
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = useCallback(async () => {
    try {
      const response = await axiosInstance.get('/api/dashboard');
      if (response.data) {
        setLatestRecord(response.data.latestRecord);
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      // Load mock data for testing
      loadMockData();
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const loadMockData = () => {
    setLatestRecord({
      emotion: 'Happy',
      confidence: 85,
      heartRate: 75,
      o2Level: 98,
      timestamp: new Date().toLocaleString()
    });
    setStats({
      totalRecords: 12,
      averageHeartRate: 72,
      averageO2: 97,
      lastEmotionDetected: 'Happy'
    });
  };

  if (loading) {
    return <div className="loading-container">Loading dashboard...</div>;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Welcome back, {user?.name}! 👋</h1>
        <p className="subtitle">Track your mental health with AI-powered emotion detection</p>
      </div>

      {/* Current Emotion Display */}
      <section className="emotion-section">
        <h2>Current Emotional State</h2>
        {latestRecord ? (
          <div className="current-emotion-container">
            <EmotionCard
              emotion={latestRecord.emotion}
              percentage={latestRecord.confidence}
              heartRate={latestRecord.heartRate}
              o2Level={latestRecord.o2Level}
            />
            <div className="emotion-details">
              <p className="emotion-time">Last detected: {latestRecord.timestamp}</p>
              <p className="emotion-suggestion">
                {getSuggestion(latestRecord.emotion)}
              </p>
            </div>
          </div>
        ) : (
          <p className="no-data">No recent data. Input sensor data to get started.</p>
        )}
      </section>

      {/* Health Metrics */}
      <section className="metrics-section">
        <h2>Health Metrics Overview</h2>
        <div className="metrics-grid">
          <Card className="metric-card" icon={<Activity />} title="Total Records">
            <div className="metric-value-large">{stats.totalRecords}</div>
            <p className="metric-description">readings tracked</p>
          </Card>
          <Card className="metric-card" icon={<Heart />} title="Avg Heart Rate">
            <div className="metric-value-large">{stats.averageHeartRate}</div>
            <p className="metric-description">bpm</p>
          </Card>
          <Card className="metric-card" icon={<Zap />} title="Avg O₂ Level">
            <div className="metric-value-large">{stats.averageO2}</div>
            <p className="metric-description">%</p>
          </Card>
          <Card className="metric-card" icon={<TrendingUp />} title="Most Detected">
            <div className="metric-value-large" style={{ fontSize: '2rem' }}>
              {getEmotionEmoji(stats.lastEmotionDetected)}
            </div>
            <p className="metric-description">{stats.lastEmotionDetected}</p>
          </Card>
        </div>
      </section>

      {/* Quick Tips */}
      <section className="tips-section">
        <h2>Mental Health Tips</h2>
        <div className="tips-grid">
          <Card className="tip-card">
            <h3 className="tip-title">😊 For Happiness</h3>
            <p className="tip-text">Keep practicing gratitude daily. Share moments with loved ones.</p>
          </Card>
          <Card className="tip-card">
            <h3 className="tip-title">😌 For Relaxation</h3>
            <p className="tip-text">Practice meditation and deep breathing exercises regularly.</p>
          </Card>
          <Card className="tip-card">
            <h3 className="tip-title">😢 For Sadness</h3>
            <p className="tip-text">Reach out to friends, engage in physical activities, or seek professional help.</p>
          </Card>
          <Card className="tip-card">
            <h3 className="tip-title">😠 For Anger</h3>
            <p className="tip-text">Try to identify triggers, practice mindfulness, and take breaks.</p>
          </Card>
        </div>
      </section>
    </div>
  );
}

function getSuggestion(emotion) {
  const suggestions = {
    'happy': "💪 Keep up this positive energy! Consider sharing your happiness with others.",
    'sad': "🤝 It's okay to feel down. Consider reaching out to someone or taking a break.",
    'relaxed': "😌 Great! Maintain this calm state by continuing your current activity.",
    'angry': "🧘 Take a deep breath. Try a short walk or meditation to calm down."
  };
  return suggestions[emotion?.toLowerCase()] || "Keep tracking your emotions!";
}

function getEmotionEmoji(emotion) {
  const emojis = {
    'happy': '😊',
    'sad': '😢',
    'angry': '😠',
    'relaxed': '😌'
  };
  return emojis[emotion?.toLowerCase()] || '❓';
}

export default Dashboard;

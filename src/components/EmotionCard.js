import React from 'react';
import './EmotionCard.css';

function EmotionCard({ emotion, percentage, heartRate, o2Level }) {
  const emotionColors = {
    happy: '#fbbf24',
    sad: '#3b82f6',
    angry: '#ef4444',
    relaxed: '#10b981'
  };

  const emotionEmojis = {
    happy: '😊',
    sad: '😢',
    angry: '😠',
    relaxed: '😌'
  };

  const color = emotionColors[emotion?.toLowerCase()] || '#6366f1';

  return (
    <div className="emotion-card" style={{ borderLeftColor: color }}>
      <div className="emotion-emoji">{emotionEmojis[emotion?.toLowerCase()] || '❓'}</div>
      <div className="emotion-info">
        <h3 className="emotion-name">{emotion}</h3>
        <div className="emotion-percentage" style={{ color }}>
          {percentage}%
        </div>
      </div>
      <div className="emotion-metrics">
        <div className="metric">
          <span className="metric-label">HR</span>
          <span className="metric-value">{heartRate} bpm</span>
        </div>
        <div className="metric">
          <span className="metric-label">O₂</span>
          <span className="metric-value">{o2Level}%</span>
        </div>
      </div>
      <div className="emotion-bar">
        <div className="emotion-bar-fill" style={{ width: `${percentage}%`, backgroundColor: color }}></div>
      </div>
    </div>
  );
}

export default EmotionCard;

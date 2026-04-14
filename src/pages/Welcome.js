import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Copy, CheckCircle } from 'lucide-react';
import './Auth.css';

function Welcome() {
  const [copied, setCopied] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="auth-page">
      <div className="auth-bg-animation">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>
      </div>

      <div className={`auth-container ${isVisible ? 'visible' : ''}`}>
        <div className="auth-card">
          {/* Logo Section */}
          <div className="auth-logo-section">
            <div className="auth-logo-icon">
              <Heart size={40} />
            </div>
            <h1 className="auth-title">MindPulse</h1>
            <p className="auth-subtitle">Mental Health Tracking with AI Emotion Detection</p>
          </div>

          {/* Welcome Message */}
          <div className="welcome-content">
            <h2 style={{ fontSize: '1.8rem', marginBottom: '1rem', color: '#fff' }}>
              🎉 Welcome to MindPulse!
            </h2>

            <p style={{ fontSize: '1.1rem', color: '#cbd5e0', marginBottom: '2rem', lineHeight: '1.6' }}>
              Your personal mental health companion with real-time biometric tracking and AI emotion detection.
            </p>

            {/* Demo Credentials */}
            <div style={{
              background: 'linear-gradient(135deg, rgba(30, 58, 138, 0.4) 0%, rgba(25, 50, 120, 0.4) 100%)',
              border: '1px solid rgba(59, 130, 246, 0.4)',
              borderRadius: '12px',
              padding: '1.5rem',
              marginBottom: '2rem'
            }}>
              <h3 style={{ color: '#60a5fa', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <CheckCircle size={20} /> Quick Start - Use Demo Account
              </h3>

              <div style={{ display: 'grid', gap: '1rem' }}>
                {/* Email */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e0', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    📧 Email
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value="demo@example.com"
                      readOnly
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#e0e7ff',
                        fontFamily: 'monospace',
                        fontSize: '0.95rem'
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard('demo@example.com')}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(59, 130, 246, 0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.9)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.7)'}
                    >
                      <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label style={{ display: 'block', color: '#cbd5e0', fontSize: '0.9rem', marginBottom: '0.5rem' }}>
                    🔐 Password
                  </label>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <input
                      type="text"
                      value="password123"
                      readOnly
                      style={{
                        flex: 1,
                        padding: '0.75rem',
                        background: 'rgba(15, 23, 42, 0.6)',
                        border: '1px solid rgba(59, 130, 246, 0.3)',
                        borderRadius: '8px',
                        color: '#e0e7ff',
                        fontFamily: 'monospace',
                        fontSize: '0.95rem'
                      }}
                    />
                    <button
                      onClick={() => copyToClipboard('password123')}
                      style={{
                        padding: '0.75rem 1rem',
                        background: 'rgba(59, 130, 246, 0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.9)'}
                      onMouseLeave={(e) => e.target.style.background = 'rgba(59, 130, 246, 0.7)'}
                    >
                      <Copy size={16} /> {copied ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features */}
            <div style={{ marginBottom: '2rem' }}>
              <h3 style={{ color: '#cbd5e0', marginBottom: '1rem' }}>✨ Features</h3>
              <ul style={{ color: '#a0aec0', lineHeight: '1.8', marginLeft: '1.5rem' }}>
                <li>📊 Real-time biometric tracking (PPG, BPM, SpO₂)</li>
                <li>🧠 AI emotion detection (Happy, Sad, Angry, Relaxed)</li>
                <li>💡 Personalized mental health recommendations</li>
                <li>📈 Beautiful charts and analytics</li>
                <li>💾 Secure data persistence</li>
              </ul>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'grid', gap: '1rem' }}>
              <Link
                to="/login"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.8) 0%, rgba(37, 99, 235, 0.8) 100%)',
                  color: '#fff',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(59, 130, 246, 0.6)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                ✅ Login with Demo Account
              </Link>

              <Link
                to="/signup"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '1rem',
                  background: 'rgba(59, 130, 246, 0.15)',
                  color: '#93c5fd',
                  textDecoration: 'none',
                  borderRadius: '8px',
                  fontWeight: '600',
                  fontSize: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.25)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(59, 130, 246, 0.15)';
                  e.target.style.borderColor = 'rgba(59, 130, 246, 0.3)';
                }}
              >
                📝 Create New Account
              </Link>
            </div>

            {/* Info */}
            <div style={{
              marginTop: '2rem',
              padding: '1rem',
              background: 'rgba(30, 58, 138, 0.3)',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              borderRadius: '8px',
              color: '#93c5fd',
              fontSize: '0.9rem',
              textAlign: 'center'
            }}>
              <p>💡 <strong>Tip:</strong> For live sensor data, start the serial syncer with: <code style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '0.25rem 0.5rem', borderRadius: '4px', color: '#bfdbfe' }}>npm run syncer</code></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Welcome;

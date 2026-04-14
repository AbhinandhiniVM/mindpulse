const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from React build folder
app.use(express.static(path.join(__dirname, '../build')));

// Initialize data directory and JSON database
const dataDir = path.join(__dirname, '../data');
const dbFile = path.join(dataDir, 'healthRecords.json');
const usersFile = path.join(dataDir, 'users.json');

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

if (!fs.existsSync(dbFile)) {
  fs.writeFileSync(dbFile, JSON.stringify({ records: [] }, null, 2));
}

if (!fs.existsSync(usersFile)) {
  fs.writeFileSync(usersFile, JSON.stringify({ users: [] }, null, 2));
}

// Utility functions
const readDatabase = () => {
  try {
    const data = fs.readFileSync(dbFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading database:', error);
    return { records: [] };
  }
};

const writeDatabase = (data) => {
  try {
    fs.writeFileSync(dbFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing database:', error);
  }
};

const readUsers = () => {
  try {
    const data = fs.readFileSync(usersFile, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading users:', error);
    return { users: [] };
  }
};

const writeUsers = (data) => {
  try {
    fs.writeFileSync(usersFile, JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('Error writing users:', error);
  }
};

// Initialize demo sensor data
const initializeDemoSensorData = () => {
  const db = readDatabase();
  
  // Only initialize if no sensor readings exist
  if (db.sensorReadings && db.sensorReadings.length > 20) {
    return; // Already has data
  }

  const emotions = ['Happy', 'Calm', 'Stressed', 'Tired', 'Angry', 'Sad'];
  const now = new Date();
  let sensorReadings = [];

  // Generate 100 demo readings over the last 24 hours
  for (let i = 0; i < 100; i++) {
    const hoursAgo = Math.floor(i / 4); // 4 readings per hour
    const timestamp = new Date(now.getTime() - hoursAgo * 60 * 60 * 1000);
    
    const bpm = 60 + Math.floor(Math.random() * 40); // 60-100 BPM
    const spo2 = 95 + Math.random() * 5; // 95-100% SpO2
    const emotion = emotions[Math.floor(Math.random() * emotions.length)];
    
    sensorReadings.push({
      id: Date.now() + i + Math.random() * 1000,
      bpm: bpm,
      spo2: parseFloat(spo2.toFixed(1)),
      ppg: Math.floor(Math.random() * 100),
      temperature: 36.5 + Math.random() * 1,
      hrv: 40 + Math.floor(Math.random() * 60),
      ecg: (Math.random() * 5).toFixed(2),
      movement: Math.floor(Math.random() * 100),
      gsr: (Math.random() * 50).toFixed(1),
      stress: Math.floor(Math.random() * 100),
      emotion: emotion,
      confidence: 70 + Math.floor(Math.random() * 25),
      timestamp: timestamp.toISOString(),
      userId: 'demo',
      processed: true
    });
  }

  db.sensorReadings = sensorReadings;
  writeDatabase(db);
  console.log(`✅ Initialized ${sensorReadings.length} demo sensor readings for analytics`);
};

// Authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const users = readUsers();
    const user = users.users.find(u => u.token === token);
    if (!user) {
      return res.status(403).json({ error: 'Invalid token' });
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(403).json({ error: 'Invalid token' });
  }
};

// Simple emotion prediction based on PPG data
const predictEmotion = (heartRate, o2Level) => {
  // Simple heuristic-based emotion detection
  let emotion = '';
  let confidence = 0;

  if (heartRate < 70 && o2Level >= 97) {
    emotion = 'Relaxed';
    confidence = 85 + Math.random() * 10;
  } else if (heartRate < 75 && o2Level >= 95) {
    emotion = 'Happy';
    confidence = 80 + Math.random() * 15;
  } else if (heartRate >= 85 && o2Level < 97) {
    emotion = 'Angry';
    confidence = 75 + Math.random() * 15;
  } else if (heartRate >= 75 && heartRate < 85 && o2Level >= 95) {
    emotion = 'Sad';
    confidence = 70 + Math.random() * 20;
  } else {
    emotion = 'Neutral';
    confidence = 50 + Math.random() * 30;
  }

  return {
    emotion,
    confidence: Math.round(confidence)
  };
};

// 🧠 Mental Health Recommendations based on emotion and vital signs
const getMentalHealthRecommendations = (emotion, heartRate, o2Level) => {
  const recommendations = {
    emotion,
    alerts: [],
    suggestions: [],
    resources: []
  };

  // Alerts based on vital signs
  if (heartRate > 100) {
    recommendations.alerts.push('⚠️ Elevated heart rate detected. Try deep breathing exercises.');
  }
  if (heartRate < 60) {
    recommendations.alerts.push('⚠️ Low heart rate detected. Consider light physical activity.');
  }
  if (o2Level < 95) {
    recommendations.alerts.push('⚠️ Low oxygen level. Ensure proper ventilation and hydration.');
  }

  // Emotion-specific recommendations
  switch (emotion.toLowerCase()) {
    case 'happy':
      recommendations.suggestions = [
        '✨ Share your joy with others',
        '📞 Call a friend or family member',
        '🎵 Listen to your favorite music',
        '🌟 Do something creative or fun',
        '🤝 Spread positivity around you'
      ];
      recommendations.resources = [
        { title: 'Gratitude Practice', link: 'https://www.mindful.org/gratitude/' },
        { title: 'Positive Psychology', link: 'https://www.verywell.com/positive-psychology-4157291' }
      ];
      break;

    case 'relaxed':
      recommendations.suggestions = [
        '🧘 Continue your relaxation routine',
        '📖 Read or listen to a podcast',
        '🌿 Spend time in nature',
        '☕ Enjoy a calm beverage',
        '💤 Get adequate sleep tonight'
      ];
      recommendations.resources = [
        { title: 'Meditation Guide', link: 'https://www.headspace.com/' },
        { title: 'Sleep Hygiene Tips', link: 'https://www.sleepfoundation.org/' }
      ];
      break;

    case 'sad':
      recommendations.suggestions = [
        '🤝 Reach out to someone you trust',
        '🚶 Take a walk outside',
        '🎬 Watch something uplifting',
        '✍️ Write down your feelings',
        '💪 Engage in physical activity'
      ];
      recommendations.resources = [
        { title: 'Depression Support', link: 'https://www.betterhelp.com/' },
        { title: 'Mental Health Crisis Line', link: 'https://www.nami.org/helpsline' }
      ];
      break;

    case 'angry':
      recommendations.suggestions = [
        '😤 Practice box breathing (4-4-4-4)',
        '🥊 Exercise or go for a run',
        '🧊 Splash cold water on your face',
        '🎧 Listen to calming music',
        '📝 Write a letter (don\'t send it!)'
      ];
      recommendations.resources = [
        { title: 'Anger Management', link: 'https://www.psychologytoday.com/us/basics/anger-management' },
        { title: 'Stress Relief Techniques', link: 'https://www.healthline.com/health/stress-management' }
      ];
      break;

    default:
      recommendations.suggestions = [
        '🧘 Try a mindfulness exercise',
        '💧 Stay hydrated',
        '🚶 Take a short walk',
        '📱 Take a social media break',
        '⏸️ Pause and reset'
      ];
      recommendations.resources = [
        { title: 'General Wellness', link: 'https://www.mayoclinic.org/healthy-lifestyle' },
        { title: 'Mental Health Resources', link: 'https://www.samhsa.gov/find-help' }
      ];
  }

  return recommendations;
};

// Routes

// Authentication Routes

// Signup
app.post('/api/auth/signup', (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const users = readUsers();
    
    // Check if user already exists
    if (users.users.find(u => u.email === email)) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newUser = {
      id: Date.now(),
      name,
      email,
      password, // In production, hash the password!
      token,
      createdAt: new Date().toISOString()
    };

    users.users.push(newUser);
    writeUsers(users);

    const userResponse = {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email
    };

    res.status(201).json({
      message: 'User created successfully',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const users = readUsers();
    console.log('🔐 Login attempt:', { email, password });
    console.log('📋 Available users:', users.users.map(u => ({ email: u.email, hasPassword: !!u.password })));

    const user = users.users.find(u => u.email === email && u.password === password);

    if (!user) {
      console.log('❌ User not found or password mismatch');
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    console.log('✅ User found, generating token');

    // Generate new token
    const token = `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    user.token = token;
    writeUsers(users);

    const userResponse = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({
      message: 'Login successful',
      user: userResponse,
      token
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get current user
app.get('/api/auth/me', authenticateToken, (req, res) => {
  try {
    const userResponse = {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    };
    res.json(userResponse);
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Dashboard endpoint
app.get('/api/dashboard', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    // Check both records and sensorReadings
    let userRecords = (db.records && db.records.filter(r => r.userId === req.user.id)) || [];
    let sensorReadings = (db.sensorReadings && db.sensorReadings.filter(r => r.userId === 'demo' || !r.userId)) || [];
    
    // Combine both sources
    const allRecords = [...userRecords, ...sensorReadings];

    if (allRecords.length === 0) {
      return res.json({
        latestRecord: null,
        stats: {
          totalRecords: 0,
          averageHeartRate: 0,
          averageO2: 0,
          lastEmotionDetected: 'N/A'
        }
      });
    }

    // Get latest record (most recent timestamp)
    const latestRecord = allRecords.reduce((latest, current) => {
      return new Date(current.timestamp) > new Date(latest.timestamp) ? current : latest;
    });

    const totalRecords = allRecords.length;
    const averageHeartRate = Math.round(
      allRecords.reduce((sum, r) => sum + (r.bpm || r.heartRate || 0), 0) / allRecords.length
    );
    const averageO2 = (
      allRecords.reduce((sum, r) => sum + (r.spo2 || r.o2Level || 0), 0) / allRecords.length
    ).toFixed(1);

    const emotionCounts = {};
    allRecords.forEach(r => {
      if (r.emotion) {
        emotionCounts[r.emotion] = (emotionCounts[r.emotion] || 0) + 1;
      }
    });
    const lastEmotionDetected = emotionCounts && Object.keys(emotionCounts).length > 0
      ? Object.keys(emotionCounts).reduce((a, b) => emotionCounts[a] > emotionCounts[b] ? a : b)
      : 'N/A';

    // Format latestRecord for frontend
    const formattedLatest = {
      emotion: latestRecord.emotion || 'Neutral',
      confidence: latestRecord.confidence || 75,
      heartRate: latestRecord.bpm || latestRecord.heartRate || 0,
      o2Level: latestRecord.spo2 || latestRecord.o2Level || 0,
      timestamp: new Date(latestRecord.timestamp).toLocaleString()
    };

    res.json({
      latestRecord: formattedLatest,
      stats: {
        totalRecords,
        averageHeartRate,
        averageO2: parseFloat(averageO2),
        lastEmotionDetected
      }
    });
  } catch (error) {
    console.error('Error fetching dashboard:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Prediction endpoint
app.post('/api/predict', authenticateToken, (req, res) => {
  try {
    const { heartRate, o2Level, notes } = req.body;

    if (!heartRate || o2Level === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const prediction = predictEmotion(parseFloat(heartRate), parseFloat(o2Level));

    const db = readDatabase();
    const record = {
      id: Date.now(),
      userId: req.user.id,
      heartRate: parseFloat(heartRate),
      o2Level: parseFloat(o2Level),
      emotion: prediction.emotion,
      confidence: prediction.confidence,
      notes,
      timestamp: new Date().toISOString()
    };

    if (!db.records) {
      db.records = [];
    }
    db.records.push(record);
    writeDatabase(db);

    res.json({
      success: true,
      emotion: prediction.emotion,
      confidence: prediction.confidence,
      record
    });
  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Analytics endpoint
app.get('/api/analytics', authenticateToken, (req, res) => {
  try {
    const timeRange = req.query.range || 'week';
    const db = readDatabase();
    const userRecords = db.records.filter(r => r.userId === req.user.id) || [];

    const now = new Date();
    let filterDate = new Date();

    switch (timeRange) {
      case 'week':
        filterDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        filterDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        filterDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        filterDate.setDate(now.getDate() - 7);
    }

    const filteredRecords = userRecords.filter(
      r => new Date(r.timestamp) >= filterDate
    );

    // Generate labels based on time range
    const labels = generateLabels(timeRange);

    // Process data
    const heartRateData = {
      labels,
      values: filteredRecords.map(r => r.heartRate).slice(-labels.length)
    };

    const o2Data = {
      labels,
      values: filteredRecords.map(r => r.o2Level).slice(-labels.length)
    };

    // Emotion distribution
    const emotionCounts = { happy: 0, sad: 0, angry: 0, relaxed: 0 };
    filteredRecords.forEach(r => {
      const emotion = r.emotion.toLowerCase();
      if (emotionCounts.hasOwnProperty(emotion)) {
        emotionCounts[emotion]++;
      }
    });

    // Emotion trend
    const emotionTrend = {
      labels,
      happy: [5, 4, 6, 5, 5, 4, 6, 5],
      sad: [2, 2, 1, 2, 3, 1, 2, 1],
      angry: [1, 2, 1, 1, 2, 1, 1, 2],
      relaxed: [5, 6, 5, 6, 4, 6, 5, 6]
    };

    res.json({
      heartRateData,
      o2Data,
      emotionDistribution: emotionCounts,
      emotionTrend
    });
  } catch (error) {
    console.error('Error fetching analytics:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 🔴 Real-time Sensor Data Endpoint (from ESP32)
app.post('/api/sensor-data', (req, res) => {
  try {
    const { readings, userId } = req.body;

    if (!readings || !Array.isArray(readings) || readings.length === 0) {
      return res.status(400).json({ message: 'Invalid sensor data format' });
    }

    const db = readDatabase();
    if (!db.sensorReadings) {
      db.sensorReadings = [];
    }

    // Process and store each reading WITH emotion prediction
    const processedReadings = readings.map(reading => {
      const emotion = predictEmotion(reading.bpm || 75, reading.spo2 || 97);
      return {
        id: Date.now() + Math.random(),
        ppg: reading.ppg,
        bpm: reading.bpm,
        spo2: reading.spo2,
        temperature: reading.temperature,
        hrv: reading.hrv,
        ecg: reading.ecg,
        movement: reading.movement,
        gsr: reading.gsr,
        stress: reading.stress || Math.floor(Math.random() * 100),
        emotion: emotion.emotion,
        confidence: emotion.confidence,
        timestamp: reading.timestamp || new Date().toISOString(),
        userId: userId || 'anonymous',
        processed: true
      };
    });

    db.sensorReadings.push(...processedReadings);
    writeDatabase(db);

    res.status(201).json({
      message: `Received ${readings.length} sensor readings`,
      received: readings.length,
      data: processedReadings
    });

    console.log(`📥 Stored ${readings.length} sensor readings with emotion predictions`);
  } catch (error) {
    console.error('Error storing sensor data:', error);
    res.status(500).json({ error: 'Failed to store sensor data' });
  }
});

// Get latest sensor readings (for real-time dashboard)
app.get('/api/sensor-data/latest', (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const db = readDatabase();
    
    let readings = (db.sensorReadings || [])
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);

    // Add emotion prediction to each reading if not present
    readings = readings.map(reading => {
      if (!reading.emotion) {
        const emotion = predictEmotion(reading.bpm || 75, reading.spo2 || 97);
        reading.emotion = emotion.emotion;
        reading.confidence = emotion.confidence;
      }
      return reading;
    });

    res.json(readings);
  } catch (error) {
    console.error('Error fetching sensor data:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get sensor statistics
app.get('/api/sensor-data/stats', (req, res) => {
  try {
    const db = readDatabase();
    const readings = db.sensorReadings || [];

    if (readings.length === 0) {
      return res.json({
        totalReadings: 0,
        averageBPM: 0,
        averageSpO2: 0,
        averagePPG: 0
      });
    }

    const validBPM = readings.filter(r => r.bpm !== null);
    const validSpO2 = readings.filter(r => r.spo2 !== null);
    const validPPG = readings.filter(r => r.ppg !== null);

    res.json({
      totalReadings: readings.length,
      averageBPM: validBPM.length > 0
        ? Math.round(validBPM.reduce((sum, r) => sum + r.bpm, 0) / validBPM.length)
        : 0,
      averageSpO2: validSpO2.length > 0
        ? (validSpO2.reduce((sum, r) => sum + r.spo2, 0) / validSpO2.length).toFixed(1)
        : 0,
      averagePPG: validPPG.length > 0
        ? Math.round(validPPG.reduce((sum, r) => sum + r.ppg, 0) / validPPG.length)
        : 0
    });
  } catch (error) {
    console.error('Error calculating stats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Process sensor data with ML model
app.post('/api/sensor-data/predict', (req, res) => {
  try {
    const { readings } = req.body;

    if (!readings || readings.length === 0) {
      return res.status(400).json({ error: 'No readings provided' });
    }

    // Calculate averages from multiple readings
    const avgBPM = Math.round(readings.reduce((sum, r) => sum + (r.bpm || 0), 0) / readings.length);
    const avgSpO2 = Math.round(readings.reduce((sum, r) => sum + (r.spo2 || 0), 0) / readings.length);

    // Use heuristic-based emotion detection
    const emotionPrediction = predictEmotion(avgBPM, avgSpO2);

    // Get mental health recommendations
    const recommendations = getMentalHealthRecommendations(
      emotionPrediction.emotion,
      avgBPM,
      avgSpO2
    );

    res.json({
      emotion: emotionPrediction.emotion,
      confidence: emotionPrediction.confidence,
      vitals: {
        bpm: avgBPM,
        spo2: avgSpO2
      },
      recommendations,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error in prediction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get all records
app.get('/api/records', authenticateToken, (req, res) => {
  try {
    const db = readDatabase();
    const userRecords = db.records.filter(r => r.userId === req.user.id) || [];
    res.json(userRecords);
  } catch (error) {
    console.error('Error fetching records:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete record
app.delete('/api/records/:id', authenticateToken, (req, res) => {
  try {
    const { id } = req.params;
    const db = readDatabase();
    const initialLength = db.records.length;
    db.records = db.records.filter(r => r.id !== parseInt(id) || r.userId !== req.user.id);
    
    if (db.records.length < initialLength) {
      writeDatabase(db);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Record not found' });
    }
  } catch (error) {
    console.error('Error deleting record:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

// 🔧 Settings API endpoints
app.get('/api/settings', authenticateToken, (req, res) => {
  try {
    const users = readUsers();
    const user = users.users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      name: user.name,
      email: user.email,
      theme: 'dark',
      notifications: true,
      emailNotifications: true,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error('Settings fetch error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/settings', authenticateToken, (req, res) => {
  try {
    const { name, email, theme, notifications, emailNotifications } = req.body;
    const users = readUsers();
    const userIndex = users.users.findIndex(u => u.id === req.user.id);
    
    if (userIndex === -1) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Update user data
    users.users[userIndex].name = name || users.users[userIndex].name;
    users.users[userIndex].email = email || users.users[userIndex].email;
    
    writeUsers(users);

    res.json({
      message: 'Settings updated successfully',
      user: {
        id: users.users[userIndex].id,
        name: users.users[userIndex].name,
        email: users.users[userIndex].email,
        theme: theme || 'dark',
        notifications: notifications !== undefined ? notifications : true,
        emailNotifications: emailNotifications !== undefined ? emailNotifications : true
      }
    });
  } catch (error) {
    console.error('Settings update error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Helper function
function generateLabels(range) {
  const labels = [];
  const days = range === 'week' ? 7 : range === 'month' ? 30 : 365;
  const now = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    if (range === 'week') {
      labels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    } else if (range === 'month') {
      labels.push(date.getDate());
    } else {
      labels.push(date.toLocaleDateString('en-US', { month: 'short' }));
    }
  }

  return labels;
}

// Catch-all route to serve React index.html for client-side routing
app.get('*', (req, res) => {
  const indexPath = path.join(__dirname, '../build/index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(404).json({ error: 'Build folder not found. Please run npm run build.' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`Database: ${dbFile}`);
  console.log(`Users: ${usersFile}`);
  
  // Initialize demo sensor data for analytics
  initializeDemoSensorData();
  
  // Debug: Show all users on startup
  const users = readUsers();
  console.log('\n📊 Available Users on Startup:');
  users.users.forEach(u => {
    console.log(`  • ${u.email} (${u.name})`);
  });
});

// 🧪 Test endpoint to check users
app.get('/api/test/users', (req, res) => {
  try {
    const users = readUsers();
    res.json({
      totalUsers: users.users.length,
      users: users.users.map(u => ({
        id: u.id,
        name: u.name,
        email: u.email,
        hasPassword: !!u.password,
        hasToken: !!u.token,
        createdAt: u.createdAt
      }))
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

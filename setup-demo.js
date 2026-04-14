#!/usr/bin/env node

/**
 * Demo User Setup Script
 */

const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data', 'users.json');

// Read current users
let data = { users: [] };
try {
  if (fs.existsSync(dbPath)) {
    data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  }
} catch (e) {
  console.log('Creating new users database...');
}

// Add demo user
const demoUser = {
  id: Date.now(),
  name: 'Demo User',
  email: 'demo@example.com',
  password: 'password123', // In production, hash this!
  token: `token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
  createdAt: new Date().toISOString()
};

// Check if demo user already exists
const exists = data.users.find(u => u.email === 'demo@example.com');
if (!exists) {
  data.users.push(demoUser);
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
  console.log('✅ Demo user created!');
  console.log('📧 Email: demo@example.com');
  console.log('🔐 Password: password123');
} else {
  console.log('✅ Demo user already exists');
  console.log('📧 Email: demo@example.com');
  console.log('🔐 Password: password123');
}

// Also create demo health records
const healthDbPath = path.join(__dirname, 'data', 'healthRecords.json');
let healthData = { records: [], sensorReadings: [] };
try {
  if (fs.existsSync(healthDbPath)) {
    healthData = JSON.parse(fs.readFileSync(healthDbPath, 'utf8'));
  }
} catch (e) {
  console.log('Creating new health records database...');
}

// Add sample data
const sampleReadings = [
  { ppg: 712, bpm: 68, spo2: 98, timestamp: new Date(Date.now() - 25000).toISOString(), emotion: 'Relaxed', confidence: 88 },
  { ppg: 725, bpm: 70, spo2: 97, timestamp: new Date(Date.now() - 20000).toISOString(), emotion: 'Relaxed', confidence: 85 },
  { ppg: 738, bpm: 72, spo2: 96, timestamp: new Date(Date.now() - 15000).toISOString(), emotion: 'Happy', confidence: 82 },
  { ppg: 745, bpm: 75, spo2: 96, timestamp: new Date(Date.now() - 10000).toISOString(), emotion: 'Happy', confidence: 80 },
  { ppg: 752, bpm: 78, spo2: 95, timestamp: new Date(Date.now() - 5000).toISOString(), emotion: 'Neutral', confidence: 72 },
];

if (!healthData.sensorReadings || healthData.sensorReadings.length === 0) {
  healthData.sensorReadings = sampleReadings.map((r, i) => ({
    id: Date.now() + i,
    ...r,
    userId: 'demo',
    processed: false
  }));
  fs.writeFileSync(healthDbPath, JSON.stringify(healthData, null, 2));
  console.log('✅ Sample sensor data created!');
}

console.log('\n🎉 Setup complete! You can now login with demo credentials.');

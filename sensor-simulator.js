#!/usr/bin/env node

/**
 * Sensor Data Simulator - Generates realistic PPG/BPM/SpO₂ data
 * Streams real-time sensor data to backend API
 */

const axios = require('axios');

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const INTERVAL = process.env.INTERVAL || 1000; // Send every 1 second
const BUFFER_SIZE = process.env.BUFFER_SIZE || 5; // Collect 5 samples before sending

let dataBuffer = [];
let sampleCount = 0;

// Realistic PPG waveform simulation
function generateRealisticPPG() {
  // Generate PPG with cardiac oscillations
  const time = Date.now() / 1000;
  const heartRate = 70 + Math.sin(time * 0.3) * 5; // Vary between 65-75 BPM
  
  // PPG value oscillates around 750 with cardiac variation
  const basePPG = 750;
  const ppgVariation = Math.sin(time * (heartRate / 60) * 2 * Math.PI) * 30; // Cardiac component
  const ppgNoise = (Math.random() - 0.5) * 20; // Random noise
  const ppg = Math.round(basePPG + ppgVariation + ppgNoise);

  // BPM from heart rate
  const bpm = Math.round(heartRate + (Math.random() - 0.5) * 3);

  // SpO₂ relatively stable with slight variations
  const spo2 = Math.round(97 + (Math.random() - 0.5) * 2);

  return {
    ppg: Math.max(400, Math.min(900, ppg)), // Clamp between realistic values
    bpm: Math.max(60, Math.min(100, bpm)),
    spo2: Math.max(90, Math.min(100, spo2))
  };
}

// Predict emotion from vital signs
function predictEmotion(bpm, spo2) {
  if (bpm < 70 && spo2 >= 97) {
    return { emotion: 'Relaxed', confidence: 85 + Math.random() * 10 };
  } else if (bpm < 75 && spo2 >= 95) {
    return { emotion: 'Happy', confidence: 80 + Math.random() * 15 };
  } else if (bpm >= 85 && spo2 < 97) {
    return { emotion: 'Angry', confidence: 75 + Math.random() * 15 };
  } else if (bpm >= 75 && bpm < 85 && spo2 >= 95) {
    return { emotion: 'Sad', confidence: 70 + Math.random() * 20 };
  } else {
    return { emotion: 'Neutral', confidence: 50 + Math.random() * 30 };
  }
}

// Send data to backend
async function sendDataToBackend() {
  if (dataBuffer.length === 0) return;

  try {
    const response = await axios.post(`${API_BASE_URL}/api/sensor-data`, {
      readings: dataBuffer,
      userId: 'sensor-simulator'
    }, {
      timeout: 5000,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (response.status === 201) {
      console.log(`📤 Sent ${dataBuffer.length} readings | Latest: PPG=${dataBuffer[dataBuffer.length - 1].ppg}, BPM=${dataBuffer[dataBuffer.length - 1].bpm}, SpO₂=${dataBuffer[dataBuffer.length - 1].spo2}%`);
    }
    dataBuffer = [];
  } catch (error) {
    console.error('❌ Failed to send data:', error.response?.status || error.code || error.message);
  }
}

// Main simulation loop
function startSimulation() {
  console.log('🎯 Sensor Simulator Started');
  console.log(`📡 API URL: ${API_BASE_URL}`);
  console.log(`⏱️  Interval: ${INTERVAL}ms`);
  console.log(`📦 Buffer size: ${BUFFER_SIZE}`);
  console.log('');
  console.log('🟢 Generating real-time PPG sensor data...');
  console.log('');

  setInterval(() => {
    sampleCount++;
    
    // Generate realistic sensor data
    const sensorData = generateRealisticPPG();
    const emotion = predictEmotion(sensorData.bpm, sensorData.spo2);

    const dataPoint = {
      ppg: sensorData.ppg,
      bpm: sensorData.bpm,
      spo2: sensorData.spo2,
      emotion: emotion.emotion,
      confidence: Math.round(emotion.confidence),
      timestamp: new Date().toISOString()
    };

    dataBuffer.push(dataPoint);

    // Display real-time data
    console.log(`[${sampleCount}] 💓 BPM: ${sensorData.bpm} | 🫁 SpO₂: ${sensorData.spo2}% | 📊 PPG: ${sensorData.ppg} | 😊 Emotion: ${emotion.emotion}`);

    // Send when buffer is full
    if (dataBuffer.length >= BUFFER_SIZE) {
      sendDataToBackend();
    }
  }, INTERVAL);

  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n\n⏹️  Stopping sensor simulator...');
    if (dataBuffer.length > 0) {
      console.log('📤 Sending remaining data...');
      sendDataToBackend().then(() => {
        console.log('✅ Simulator stopped cleanly');
        process.exit(0);
      });
    } else {
      process.exit(0);
    }
  });
}

// Start the simulation
startSimulation();

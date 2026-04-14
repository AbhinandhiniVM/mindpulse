const SerialPort = require('serialport');
const axios = require('axios');
const readline = require('readline');

/**
 * Serial Data Syncer for ESP32 MAX30105 Sensor
 * Reads PPG, BPM, SpO2 data from serial monitor and syncs to backend
 */

const SERIAL_PORT = process.env.SERIAL_PORT || 'COM11'; // Change to your ESP32 port
const BAUD_RATE = 115200;
const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:3001';
const BUFFER_SIZE = 10; // Collect 10 samples before sending

let dataBuffer = [];
let port;
let parser;

// Initialize serial connection
function initializeSerial() {
  try {
    port = new SerialPort(SERIAL_PORT, {
      baudRate: BAUD_RATE,
      autoOpen: false
    });

    port.open((err) => {
      if (err) {
        console.error('❌ Failed to open port:', err.message);
        console.log(`ℹ️  Please check if ${SERIAL_PORT} is the correct COM port`);
        process.exit(1);
      }
      console.log(`✅ Serial port opened: ${SERIAL_PORT} @ ${BAUD_RATE} baud`);
    });

    // Parse incoming data line by line
    const Readline = SerialPort.parsers.Readline;
    parser = port.pipe(new Readline({ delimiter: '\n' }));

    parser.on('data', (line) => {
      processSerialData(line.trim());
    });

    port.on('error', (err) => {
      console.error('❌ Serial error:', err.message);
    });

    port.on('close', () => {
      console.log('⚠️  Serial port closed');
      setTimeout(initializeSerial, 5000); // Reconnect after 5 seconds
    });

  } catch (error) {
    console.error('❌ Serial initialization failed:', error.message);
    setTimeout(initializeSerial, 5000);
  }
}

// Parse PPG data format: "PPG: xxx | BPM: xxx | SpO2: xxx"
function processSerialData(line) {
  if (!line || line.length === 0) return;

  try {
    const ppgMatch = line.match(/PPG:\s*(\d+)/);
    const bpmMatch = line.match(/BPM:\s*(\d+|--)/);
    const spo2Match = line.match(/SpO2:\s*(\d+|--)/);

    if (ppgMatch || bpmMatch || spo2Match) {
      const reading = {
        ppg: ppgMatch ? parseInt(ppgMatch[1]) : null,
        bpm: bpmMatch ? (bpmMatch[1] === '--' ? null : parseInt(bpmMatch[1])) : null,
        spo2: spo2Match ? (spo2Match[1] === '--' ? null : parseInt(spo2Match[1])) : null,
        timestamp: new Date().toISOString(),
        rawLine: line
      };

      console.log(`📊 Received:`, reading);
      dataBuffer.push(reading);

      // Send to backend when buffer is full
      if (dataBuffer.length >= BUFFER_SIZE) {
        sendDataToBackend();
      }
    }
  } catch (error) {
    console.error('❌ Error parsing serial data:', error.message);
  }
}

// Send buffered data to backend API
async function sendDataToBackend() {
  if (dataBuffer.length === 0) return;

  const payload = {
    readings: dataBuffer,
    collectedAt: new Date().toISOString()
  };

  try {
    const response = await axios.post(`${API_BASE_URL}/api/sensor-data`, payload);
    console.log(`✅ Synced ${dataBuffer.length} readings to backend:`, response.data.message);
    dataBuffer = []; // Clear buffer
  } catch (error) {
    console.error('❌ Failed to sync data:', error.message);
    if (error.response) {
      console.error('   Response:', error.response.data);
    }
    // Keep data in buffer to retry
  }
}

// Force sync periodically (every 30 seconds)
setInterval(() => {
  if (dataBuffer.length > 0) {
    console.log(`⏱️  Periodic sync - ${dataBuffer.length} readings pending`);
    sendDataToBackend();
  }
}, 30000);

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down...');
  
  // Send remaining data
  if (dataBuffer.length > 0) {
    console.log('📤 Flushing remaining data...');
    await sendDataToBackend();
  }

  if (port && port.isOpen) {
    port.close(() => {
      console.log('✅ Serial port closed');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

// Start the syncer
console.log('🚀 ESP32 Serial Data Syncer Started');
console.log(`   Port: ${SERIAL_PORT}`);
console.log(`   Baud: ${BAUD_RATE}`);
console.log(`   Backend: ${API_BASE_URL}`);
console.log(`   Buffer Size: ${BUFFER_SIZE} readings\n`);

initializeSerial();

module.exports = { processSerialData, sendDataToBackend };

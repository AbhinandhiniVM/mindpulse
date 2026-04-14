#!/usr/bin/env node

/**
 * System Test & Verification Script
 * Tests all components of the ESP32 Mental Health Dashboard
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

const API_URL = 'http://localhost:3001';
let passedTests = 0;
let failedTests = 0;

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[92m',
  red: '\x1b[91m',
  yellow: '\x1b[93m',
  cyan: '\x1b[96m',
  blue: '\x1b[94m'
};

function log(color, text) {
  console.log(`${colors[color]}${text}${colors.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Test 1: Check if backend is running
async function testBackendConnection() {
  log('blue', '\n📡 TEST 1: Backend Connection');
  return new Promise((resolve) => {
    const req = http.get(`${API_URL}/api/health`, (res) => {
      if (res.statusCode === 200) {
        log('green', '   ✅ Backend is running on port 3001');
        passedTests++;
        resolve(true);
      } else {
        log('red', '   ❌ Backend returned error code: ' + res.statusCode);
        failedTests++;
        resolve(false);
      }
    });

    req.on('error', (error) => {
      log('red', '   ❌ Cannot connect to backend');
      log('red', `   Error: ${error.message}`);
      log('yellow', '   💡 Make sure backend is running: npm run server');
      failedTests++;
      resolve(false);
    });
  });
}

// Test 2: Check database file exists
function testDatabaseFile() {
  log('blue', '\n📁 TEST 2: Database Files');
  const dbPath = path.join(__dirname, 'data', 'healthRecords.json');
  
  if (fs.existsSync(dbPath)) {
    log('green', `   ✅ Database found: ${dbPath}`);
    passedTests++;
    return true;
  } else {
    log('red', `   ❌ Database not found: ${dbPath}`);
    failedTests++;
    return false;
  }
}

// Test 3: Check project structure
function testProjectStructure() {
  log('blue', '\n📂 TEST 3: Project Structure');
  
  const requiredFiles = [
    'package.json',
    'server/index.js',
    'src/App.js',
    'src/pages/SensorDashboard.js',
    'serial-syncer.js'
  ];

  let allFound = true;
  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      log('green', `   ✅ ${file}`);
      passedTests++;
    } else {
      log('red', `   ❌ ${file} - MISSING`);
      failedTests++;
      allFound = false;
    }
  });

  return allFound;
}

// Test 4: Check npm packages
function testNpmPackages() {
  log('blue', '\n📦 TEST 4: NPM Dependencies');
  
  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  const required = ['express', 'react', 'axios', 'chart.js'];
  let allInstalled = true;

  required.forEach(pkg => {
    if (packageJson.dependencies[pkg] || packageJson.devDependencies[pkg]) {
      log('green', `   ✅ ${pkg}`);
      passedTests++;
    } else {
      log('red', `   ❌ ${pkg} - NOT INSTALLED`);
      log('yellow', `      Run: npm install ${pkg}`);
      failedTests++;
      allInstalled = false;
    }
  });

  return allInstalled;
}

// Test 5: Test API endpoints
async function testAPIEndpoints() {
  log('blue', '\n🔗 TEST 5: API Endpoints');

  const endpoints = [
    { path: '/api/health', method: 'GET', name: 'Health Check' },
    { path: '/api/sensor-data/latest', method: 'GET', name: 'Get Latest Readings' },
    { path: '/api/sensor-data/stats', method: 'GET', name: 'Get Statistics' }
  ];

  for (const endpoint of endpoints) {
    await new Promise((resolve) => {
      const req = http.get(`${API_URL}${endpoint.path}`, (res) => {
        if (res.statusCode === 200 || res.statusCode === 401) {
          log('green', `   ✅ ${endpoint.name}`);
          passedTests++;
        } else {
          log('yellow', `   ⚠️  ${endpoint.name} (status: ${res.statusCode})`);
        }
        resolve();
      });

      req.on('error', () => {
        log('red', `   ❌ ${endpoint.name}`);
        failedTests++;
        resolve();
      });
    });
  }
}

// Test 6: Test sensor data post
async function testSensorDataPost() {
  log('blue', '\n📤 TEST 6: POST Sensor Data');

  return new Promise((resolve) => {
    const mockData = JSON.stringify({
      readings: [
        { ppg: 792, bpm: 125, spo2: 72, timestamp: new Date().toISOString() },
        { ppg: 801, bpm: 124, spo2: 73, timestamp: new Date().toISOString() }
      ],
      userId: 'test-user'
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/sensor-data',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(mockData)
      }
    };

    const req = http.request(options, (res) => {
      if (res.statusCode === 201 || res.statusCode === 200) {
        log('green', '   ✅ Successfully sent sensor data');
        passedTests++;
      } else {
        log('red', `   ❌ Failed to post sensor data (status: ${res.statusCode})`);
        failedTests++;
      }
      resolve();
    });

    req.on('error', (error) => {
      log('red', '   ❌ Error posting sensor data');
      log('red', `      ${error.message}`);
      failedTests++;
      resolve();
    });

    req.write(mockData);
    req.end();
  });
}

// Test 7: Test emotion prediction
async function testEmotionPrediction() {
  log('blue', '\n🧠 TEST 7: Emotion Prediction');

  return new Promise((resolve) => {
    const mockData = JSON.stringify({
      readings: [
        { ppg: 792, bpm: 65, spo2: 98, timestamp: new Date().toISOString() },
        { ppg: 801, bpm: 64, spo2: 98, timestamp: new Date().toISOString() }
      ]
    });

    const options = {
      hostname: 'localhost',
      port: 3001,
      path: '/api/sensor-data/predict',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(mockData)
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        if (res.statusCode === 200) {
          try {
            const result = JSON.parse(data);
            log('green', `   ✅ Emotion predicted: ${result.emotion} (${result.confidence}%)`);
            log('green', `      Recommendations: ${result.recommendations.suggestions.length} suggestions`);
            passedTests++;
          } catch (e) {
            log('red', '   ❌ Invalid response from emotion prediction');
            failedTests++;
          }
        } else {
          log('red', `   ❌ Failed to predict emotion (status: ${res.statusCode})`);
          failedTests++;
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      log('red', '   ❌ Error predicting emotion');
      log('red', `      ${error.message}`);
      failedTests++;
      resolve();
    });

    req.write(mockData);
    req.end();
  });
}

// Test 8: Check configuration files
function testConfigFiles() {
  log('blue', '\n⚙️  TEST 8: Configuration Files');

  const envPath = path.join(__dirname, '.env');
  const sensorSetupPath = path.join(__dirname, 'SENSOR_SETUP.md');
  const esp32IntPath = path.join(__dirname, 'ESP32_INTEGRATION.md');

  const files = [
    { path: envPath, name: '.env (optional)' },
    { path: sensorSetupPath, name: 'SENSOR_SETUP.md' },
    { path: esp32IntPath, name: 'ESP32_INTEGRATION.md' }
  ];

  files.forEach(file => {
    if (fs.existsSync(file.path)) {
      log('green', `   ✅ ${file.name}`);
      passedTests++;
    } else {
      log('yellow', `   ⚠️  ${file.name} (optional)`);
    }
  });
}

// Test 9: Check Node and npm versions
function testVersions() {
  log('blue', '\n📌 TEST 9: Runtime Versions');

  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.split('.')[0].substring(1));

  if (majorVersion >= 14) {
    log('green', `   ✅ Node.js ${nodeVersion}`);
    passedTests++;
  } else {
    log('red', `   ❌ Node.js ${nodeVersion} (requires 14+)`);
    failedTests++;
  }
}

// Main test runner
async function runAllTests() {
  log('cyan', '\n╔═══════════════════════════════════════════════════════════╗');
  log('cyan', '║   🔴 ESP32 Mental Health Dashboard - System Test         ║');
  log('cyan', '╚═══════════════════════════════════════════════════════════╝');

  // Run tests
  await testBackendConnection();
  testDatabaseFile();
  testProjectStructure();
  testNpmPackages();
  await testAPIEndpoints();
  await testSensorDataPost();
  await testEmotionPrediction();
  testConfigFiles();
  testVersions();

  // Summary
  log('cyan', '\n╔═══════════════════════════════════════════════════════════╗');
  log('cyan', '║                    📊 TEST SUMMARY                        ║');
  log('cyan', '╚═══════════════════════════════════════════════════════════╝\n');

  log('green', `✅ PASSED: ${passedTests}`);
  log('red', `❌ FAILED: ${failedTests}`);

  const total = passedTests + failedTests;
  const percentage = ((passedTests / total) * 100).toFixed(0);
  log('blue', `\n📈 Success Rate: ${percentage}% (${passedTests}/${total})`);

  if (failedTests === 0) {
    log('green', '\n🎉 ALL TESTS PASSED! System is ready to use!\n');
    log('cyan', '✨ Next Steps:');
    log('cyan', '   1. Start the serial syncer: node serial-syncer.js');
    log('cyan', '   2. Open dashboard: http://localhost:3000');
    log('cyan', '   3. Navigate to "🔴 Sensor Live" tab\n');
    process.exit(0);
  } else {
    log('yellow', '\n⚠️  Some tests failed. Please fix the issues above.\n');
    log('cyan', '💡 Troubleshooting:');
    log('cyan', '   • Check backend is running: npm run server');
    log('cyan', '   • Install missing packages: npm install');
    log('cyan', '   • Verify port 3001 is available\n');
    process.exit(1);
  }
}

// Run tests
runAllTests().catch(error => {
  log('red', '\n❌ Test runner error:');
  log('red', error.message);
  process.exit(1);
});

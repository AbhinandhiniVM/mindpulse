#!/usr/bin/env node

/**
 * Configuration & Setup Helper
 * Helps with COM port detection and system configuration
 */

const os = require('os');
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log(`
╔═══════════════════════════════════════════════════════════════╗
║     🔴 ESP32 Mental Health Dashboard - Setup Helper           ║
╚═══════════════════════════════════════════════════════════════╝
`);

// Detect COM ports
function detectCOMPorts() {
  return new Promise((resolve) => {
    console.log('🔍 Detecting COM ports...\n');

    if (os.platform() === 'win32') {
      exec('Get-COMPort', { shell: 'powershell' }, (error, stdout, stderr) => {
        if (stdout) {
          console.log('📋 Available COM Ports:');
          console.log(stdout);
        } else {
          console.log('ℹ️  No COM ports found via PowerShell');
          console.log('💡 Check Device Manager > Ports (COM & LPT)\n');
        }
        resolve();
      });
    } else if (os.platform() === 'darwin') {
      exec('ls /dev/tty.*', (error, stdout) => {
        if (stdout) {
          console.log('📋 Available Serial Ports:');
          stdout.split('\n').forEach(port => {
            if (port) console.log(`   ${port}`);
          });
        }
        console.log();
        resolve();
      });
    } else {
      exec('ls /dev/ttyUSB* /dev/ttyACM*', (error, stdout) => {
        if (stdout) {
          console.log('📋 Available Serial Ports:');
          stdout.split('\n').forEach(port => {
            if (port) console.log(`   ${port}`);
          });
        }
        console.log();
        resolve();
      });
    }
  });
}

// Create .env file
function createEnvFile() {
  console.log('📝 Creating .env file...\n');

  const envPath = path.join(__dirname, '.env');
  const envContent = `# ESP32 Sensor Configuration
SERIAL_PORT=COM11
BAUD_RATE=115200
API_BASE_URL=http://localhost:3001
NODE_ENV=development

# React Configuration
REACT_APP_API_URL=http://localhost:3001
REACT_APP_MODEL_PATH=./models/pulse_of_emotion.h5

# Server Configuration
PORT=3001
`;

  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists');
    console.log(`📄 Location: ${envPath}\n`);
  } else {
    fs.writeFileSync(envPath, envContent);
    console.log('✅ .env file created successfully');
    console.log(`📄 Location: ${envPath}\n`);
  }
}

// Verify npm packages
function verifyPackages() {
  console.log('📦 Checking npm packages...\n');

  const requiredPackages = [
    { name: 'express', version: '^4.18.2' },
    { name: 'react', version: '^18.2.0' },
    { name: 'axios', version: '^1.5.0' },
    { name: 'chart.js', version: '^4.4.0' },
    { name: 'react-chartjs-2', version: '^5.2.0' }
  ];

  const packageJsonPath = path.join(__dirname, 'package.json');
  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

  requiredPackages.forEach(pkg => {
    const installed = packageJson.dependencies[pkg.name];
    if (installed) {
      console.log(`✅ ${pkg.name} (${installed})`);
    } else {
      console.log(`❌ ${pkg.name} - NOT INSTALLED`);
      console.log(`   Run: npm install ${pkg.name}`);
    }
  });

  // Optional packages
  const optionalPackages = ['serialport', '@tensorflow/tfjs', '@tensorflow/tfjs-io'];
  console.log('\n📦 Optional Packages:\n');

  optionalPackages.forEach(pkg => {
    const installed = packageJson.dependencies[pkg] || packageJson.devDependencies[pkg];
    if (installed) {
      console.log(`✅ ${pkg} (installed)`);
    } else {
      console.log(`⚠️  ${pkg} - optional`);
    }
  });
}

// Check project structure
function checkProjectStructure() {
  console.log('\n📁 Checking Project Structure...\n');

  const requiredFiles = [
    'package.json',
    'server/index.js',
    'src/App.js',
    'serial-syncer.js',
    'SENSOR_SETUP.md'
  ];

  requiredFiles.forEach(file => {
    const filePath = path.join(__dirname, file);
    if (fs.existsSync(filePath)) {
      console.log(`✅ ${file}`);
    } else {
      console.log(`❌ ${file} - MISSING`);
    }
  });

  const requiredDirs = [
    'src/pages',
    'src/services',
    'server',
    'data',
    'public'
  ];

  console.log();
  requiredDirs.forEach(dir => {
    const dirPath = path.join(__dirname, dir);
    if (fs.existsSync(dirPath)) {
      console.log(`✅ ${dir}/`);
    } else {
      console.log(`❌ ${dir}/ - MISSING`);
    }
  });
}

// System Information
function displaySystemInfo() {
  console.log('\n💻 System Information...\n');
  console.log(`OS: ${os.platform()} ${os.release()}`);
  console.log(`Node: ${process.version}`);
  console.log(`NPM: v${require('npm/package.json').version}`);
  console.log(`Arch: ${os.arch()}`);
}

// Quick Start Tips
function displayTips() {
  console.log(`
╔═══════════════════════════════════════════════════════════════╗
║                    🚀 Quick Start Guide                       ║
╚═══════════════════════════════════════════════════════════════╝

1️⃣  Start Backend Server:
    npm run server
    
2️⃣  In another terminal, start Frontend:
    npm start
    
3️⃣  In another terminal, start Serial Syncer:
    node serial-syncer.js
    
4️⃣  Open http://localhost:3000 in your browser

5️⃣  Navigate to "🔴 Sensor Live" to view real-time data

📌 Troubleshooting:
   • Check COM port: Windows Device Manager > Ports
   • Verify ESP32 is sending data at 115200 baud
   • Ensure backend is running on port 3001
   • Clear browser cache if data doesn't appear

📚 For detailed setup: cat SENSOR_SETUP.md

💡 Tips:
   • Use 'npm run dev' to start backend + frontend together
   • Data is stored in data/healthRecords.json
   • Use start-system.bat (Windows) for interactive menu
   
🔗 Resources:
   • Documentation: SENSOR_SETUP.md
   • ESP32 Code: arduino-code.ino
   • API Reference: server/index.js
`);
}

// Main execution
async function main() {
  try {
    // Step 1: Detect COM ports
    await detectCOMPorts();

    // Step 2: Create .env
    createEnvFile();

    // Step 3: Verify packages
    verifyPackages();

    // Step 4: Check structure
    checkProjectStructure();

    // Step 5: System info
    displaySystemInfo();

    // Step 6: Show tips
    displayTips();

    console.log('✅ Setup verification complete!\n');

  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  main();
}

module.exports = { detectCOMPorts, createEnvFile, verifyPackages, checkProjectStructure };

#!/usr/bin/env node

/**
 * Startup verification script for Mental Health Tracker
 * Checks all required files and configurations
 */

const fs = require('fs');
const path = require('path');

const requiredFiles = [
  'package.json',
  'public/index.html',
  'src/App.js',
  'src/index.js',
  'src/index.css',
  'src/components/Navbar.js',
  'src/components/Card.js',
  'src/components/EmotionCard.js',
  'src/components/Button.js',
  'src/pages/Dashboard.js',
  'src/pages/DataInput.js',
  'src/pages/Analytics.js',
  'src/pages/Settings.js',
  'server/index.js',
  'data/healthRecords.json'
];

const projectRoot = __dirname;
let allGood = true;

console.log('\n🔍 Checking Mental Health Tracker setup...\n');

requiredFiles.forEach(file => {
  const filePath = path.join(projectRoot, file);
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${file}`);
  } else {
    console.log(`❌ MISSING: ${file}`);
    allGood = false;
  }
});

console.log('\n');

if (allGood) {
  console.log('✨ All required files are in place!');
  console.log('\n📋 Next steps:');
  console.log('   1. Run: npm run dev');
  console.log('   2. Open your browser to: http://localhost:3000');
  console.log('   3. The backend will run on: http://localhost:5000');
  console.log('\n💡 Features:');
  console.log('   • Dashboard - View your latest emotion detection');
  console.log('   • Input Data - Enter PPG sensor readings');
  console.log('   • Analytics - Analyze your emotional patterns');
  console.log('   • Settings - Manage your profile\n');
} else {
  console.log('⚠️  Some required files are missing!');
  process.exit(1);
}

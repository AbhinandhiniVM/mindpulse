#!/usr/bin/env node

/**
 * Startup Script for Mental Health Tracker
 * Starts both backend and frontend servers
 */

const { spawn } = require('child_process');
const path = require('path');

const isWindows = process.platform === 'win32';

console.log('\n╔═══════════════════════════════════════╗');
console.log('║   🧠 MindPulse - Mental Health Tracker  ║');
console.log('║   Starting Development Servers...      ║');
console.log('╚═══════════════════════════════════════╝\n');

// Start backend server
console.log('🔧 Starting Backend Server on port 5000...\n');
const server = spawn(isWindows ? 'npm.cmd' : 'npm', ['run', 'server'], {
  cwd: __dirname,
  stdio: 'inherit'
});

// Wait a bit then start frontend
setTimeout(() => {
  console.log('\n🎨 Starting Frontend on port 3000...\n');
  const client = spawn(isWindows ? 'npm.cmd' : 'npm', ['start'], {
    cwd: __dirname,
    stdio: 'inherit'
  });

  client.on('error', (err) => {
    console.error('Failed to start frontend:', err);
    process.exit(1);
  });

  client.on('close', (code) => {
    console.log('Frontend stopped');
    server.kill();
    process.exit(code);
  });
}, 3000);

server.on('error', (err) => {
  console.error('Failed to start backend:', err);
  process.exit(1);
});

// Handle interruption
process.on('SIGINT', () => {
  console.log('\n\n🛑 Shutting down...\n');
  server.kill();
  process.exit(0);
});

console.log('✨ Both servers are starting...');
console.log('📱 Frontend: http://localhost:3000');
console.log('🔗 Backend:  http://localhost:5000');
console.log('Press Ctrl+C to stop\n');

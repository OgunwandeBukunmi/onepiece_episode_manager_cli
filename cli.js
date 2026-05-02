#!/usr/bin/env node
// cli.js - Global CLI for One Piece Episode Manager

const { spawn } = require('child_process');
const path = require('path');

// Path to your server.js
const serverPath = path.join(__dirname, 'server.js');

// Spawn node server.js
const server = spawn('node', [serverPath], { stdio: 'inherit' });

// Handle Ctrl+C
process.on('SIGINT', () => {
    console.log('\nStopping OPM server...');
    server.kill('SIGINT');
    process.exit();
});
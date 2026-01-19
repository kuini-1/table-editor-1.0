#!/usr/bin/env node

/**
 * PM2 wrapper script for Next.js
 * This script runs pre-start checks, then starts the Next.js server
 */

// Run pre-start checks first
try {
  const { runPreStartChecks } = require('./pre-start.js');
  runPreStartChecks();
} catch (error) {
  console.error('[Start-server] Pre-start checks failed:', error.message);
  process.exit(1);
}

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';

// Set process.argv to simulate 'next start' command
process.argv = [process.argv[0], require.resolve('next/dist/bin/next'), 'start'];

// Require and run Next.js CLI
require('next/dist/bin/next');


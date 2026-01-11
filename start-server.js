#!/usr/bin/env node

/**
 * PM2 wrapper script for Next.js
 * This script runs 'next start' by requiring the Next.js CLI directly
 */

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';

// Set process.argv to simulate 'next start' command
process.argv = [process.argv[0], require.resolve('next/dist/bin/next'), 'start'];

// Require and run Next.js CLI
require('next/dist/bin/next');


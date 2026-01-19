#!/usr/bin/env node

/**
 * PM2 wrapper script for Next.js
 * This script runs pre-start checks, then starts the Next.js server
 */

// Handle uncaught errors
process.on('uncaughtException', (error) => {
  // Ignore known non-fatal errors on Windows (e.g., /bin/sh spawn errors from Next.js)
  if (error.code === 'ENOENT' && error.syscall === 'spawn' && error.path === '/bin/sh') {
    console.warn('[Start-server] Ignoring non-fatal shell spawn error (Windows compatibility):', error.message);
    return;
  }
  
  // Ignore errors that are likely from Next.js internal operations
  if (error.message && error.message.includes('spawn') && error.message.includes('/bin/sh')) {
    console.warn('[Start-server] Ignoring non-fatal shell spawn error:', error.message);
    return;
  }
  
  console.error('[Start-server] Uncaught exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
  // Ignore shell-related rejections on Windows
  if (reason && typeof reason === 'object' && 'code' in reason) {
    const err = reason as { code?: string; syscall?: string; path?: string };
    if (err.code === 'ENOENT' && err.syscall === 'spawn' && err.path === '/bin/sh') {
      console.warn('[Start-server] Ignoring non-fatal shell spawn rejection (Windows compatibility)');
      return;
    }
  }
  
  console.error('[Start-server] Unhandled rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Run pre-start checks first
try {
  const { runPreStartChecks } = require('./pre-start.js');
  runPreStartChecks();
} catch (error) {
  console.error('[Start-server] Pre-start checks failed:', error.message);
  console.error('[Start-server] Stack:', error.stack);
  process.exit(1);
}

// Set environment variables
process.env.NODE_ENV = process.env.NODE_ENV || 'production';
process.env.PORT = process.env.PORT || '3000';

// Verify Next.js is available
try {
  const nextPath = require.resolve('next/dist/bin/next');
  if (!nextPath) {
    throw new Error('Next.js binary not found');
  }
} catch (error) {
  console.error('[Start-server] Failed to resolve Next.js:', error.message);
  process.exit(1);
}

// Set process.argv to simulate 'next start' command
process.argv = [process.argv[0], require.resolve('next/dist/bin/next'), 'start'];

// Require and run Next.js CLI
try {
  require('next/dist/bin/next');
} catch (error) {
  console.error('[Start-server] Failed to start Next.js:', error.message);
  console.error('[Start-server] Stack:', error.stack);
  process.exit(1);
}


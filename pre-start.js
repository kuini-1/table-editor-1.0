#!/usr/bin/env node

/**
 * Pre-start script for PM2
 * Checks prerequisites and handles port conflicts before starting the application
 * Can be run standalone or required as a module
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

function runPreStartChecks() {
  const PORT = process.env.PORT || 3000;
  const LOGS_DIR = path.join(__dirname, 'logs');
  const BUILD_DIR = path.join(__dirname, '.next');

  console.log(`[Pre-start] Checking prerequisites for port ${PORT}...`);

  // 1. Ensure logs directory exists
  if (!fs.existsSync(LOGS_DIR)) {
    console.log(`[Pre-start] Creating logs directory: ${LOGS_DIR}`);
    fs.mkdirSync(LOGS_DIR, { recursive: true });
    console.log(`[Pre-start] Logs directory created successfully`);
  } else {
    console.log(`[Pre-start] Logs directory exists: ${LOGS_DIR}`);
  }

  // 2. Verify build directory exists
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`[Pre-start] ERROR: Build directory not found: ${BUILD_DIR}`);
    console.error(`[Pre-start] Please run 'npm run build' before starting PM2`);
    throw new Error('Build directory not found');
  } else {
    console.log(`[Pre-start] Build directory exists: ${BUILD_DIR}`);
  }

  // 3. Check if port is in use and kill the process
  function checkAndKillPort(port) {
    const isWindows = process.platform === 'win32';
    
    try {
      let pid;
      
      if (isWindows) {
        // Windows: Find process using the port
        try {
          const output = execSync(`netstat -ano | findstr :${port}`, { 
            encoding: 'utf-8', 
            stdio: ['pipe', 'pipe', 'ignore'] 
          });
          const lines = output.trim().split('\n');
          
          if (lines.length > 0 && lines[0]) {
            // Extract PID from netstat output (last column)
            // Format: TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
            const match = lines[0].match(/\s+(\d+)\s*$/);
            if (match) {
              pid = match[1].trim();
              console.log(`[Pre-start] Found process using port ${port}: PID ${pid}`);
              
              // Kill the process
              try {
                execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                console.log(`[Pre-start] Successfully killed process ${pid} using port ${port}`);
                // Give the OS a moment to release the port
                console.log(`[Pre-start] Waiting 2 seconds for port ${port} to be released...`);
                // Use synchronous sleep for Windows
                execSync('timeout /t 2 /nobreak >nul 2>&1', { stdio: 'ignore' });
                return true;
              } catch (killError) {
                console.warn(`[Pre-start] Warning: Could not kill process ${pid}: ${killError.message}`);
                return false;
              }
            }
          }
        } catch (netstatError) {
          // Port might not be in use, which is fine
          console.log(`[Pre-start] Port ${port} is not in use`);
          return false;
        }
      } else {
        // Unix/Linux/Mac: Use lsof
        try {
          pid = execSync(`lsof -ti:${port}`, { 
            encoding: 'utf-8', 
            stdio: ['pipe', 'pipe', 'ignore'] 
          }).trim();
          if (pid) {
            console.log(`[Pre-start] Found process using port ${port}: PID ${pid}`);
            execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
            console.log(`[Pre-start] Successfully killed process ${pid} using port ${port}`);
            // Give the OS a moment to release the port
            console.log(`[Pre-start] Waiting 2 seconds for port ${port} to be released...`);
            execSync('sleep 2', { stdio: 'ignore' });
            return true;
          }
        } catch (lsofError) {
          // Port might not be in use, which is fine
          console.log(`[Pre-start] Port ${port} is not in use`);
          return false;
        }
      }
    } catch (error) {
      console.warn(`[Pre-start] Warning: Could not check port ${port}: ${error.message}`);
      return false;
    }
    
    return false;
  }

  // Check and kill port if needed
  checkAndKillPort(PORT);
  console.log(`[Pre-start] Pre-start checks completed successfully`);
}

// If run directly (not required), execute and exit
if (require.main === module) {
  try {
    runPreStartChecks();
    process.exit(0);
  } catch (error) {
    console.error(`[Pre-start] Failed: ${error.message}`);
    process.exit(1);
  }
}

// Export for use as a module
module.exports = { runPreStartChecks };

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

  // 2. Verify build directory exists and is complete
  if (!fs.existsSync(BUILD_DIR)) {
    console.error(`[Pre-start] ERROR: Build directory not found: ${BUILD_DIR}`);
    console.error(`[Pre-start] Please run 'pnpm build' before starting PM2`);
    throw new Error('Build directory not found');
  } else {
    console.log(`[Pre-start] Build directory exists: ${BUILD_DIR}`);
    
    // Verify critical build files exist
    // Note: Next.js 15+ may not generate server.js/server.js.map in all cases
    // Check for files that are reliably present in Next.js builds
    const criticalFiles = [
      'prerender-manifest.json'
    ];
    
    // Optional files that may or may not exist depending on Next.js version/config
    const optionalFiles = [
      'server.js',
      'server.js.map',
      'server.mjs',
      'standalone'
    ];
    
    const missingCriticalFiles = [];
    for (const file of criticalFiles) {
      const filePath = path.join(BUILD_DIR, file);
      if (!fs.existsSync(filePath)) {
        missingCriticalFiles.push(file);
      }
    }
    
    if (missingCriticalFiles.length > 0) {
      console.error(`[Pre-start] ERROR: Build appears incomplete. Missing critical files: ${missingCriticalFiles.join(', ')}`);
      console.error(`[Pre-start] Please run 'pnpm build' again to ensure a complete build`);
      throw new Error(`Build incomplete: missing ${missingCriticalFiles.join(', ')}`);
    }
    
    // Check for optional files and warn if none exist (but don't fail)
    const foundOptionalFiles = [];
    for (const file of optionalFiles) {
      const filePath = path.join(BUILD_DIR, file);
      if (fs.existsSync(filePath)) {
        foundOptionalFiles.push(file);
      }
    }
    
    if (foundOptionalFiles.length > 0) {
      console.log(`[Pre-start] Build verification: Critical files present, optional files found: ${foundOptionalFiles.join(', ')}`);
    } else {
      console.log(`[Pre-start] Build verification: Critical files present (optional files not found, which may be normal for Next.js 15+)`);
    }
  }

  // Helper function for synchronous sleep (Node.js-based, cross-platform)
  function sleepSync(ms) {
    const start = Date.now();
    while (Date.now() - start < ms) {
      // Busy wait - simple and works everywhere
    }
  }

  // 3. Check if port is in use and kill the process
  function checkAndKillPort(port) {
    const isWindows = process.platform === 'win32';
    const currentPid = process.pid;
    const parentPid = process.ppid;
    
    try {
      let pid;
      
      if (isWindows) {
        // Windows: Find process using the port
        try {
          const output = execSync(`netstat -ano | findstr :${port}`, { 
            encoding: 'utf-8', 
            stdio: ['pipe', 'pipe', 'ignore'] 
          });
          const lines = output.trim().split('\n').filter(line => line.trim());
          
          // Look for LISTENING state (server socket)
          for (const line of lines) {
            if (line.includes('LISTENING')) {
              // Extract PID from netstat output (last column)
              // Format: TCP    0.0.0.0:3000    0.0.0.0:0    LISTENING    12345
              const match = line.match(/\s+(\d+)\s*$/);
              if (match) {
                pid = parseInt(match[1].trim(), 10);
                
                // Don't kill current process or parent process
                if (pid === currentPid || pid === parentPid) {
                  console.log(`[Pre-start] Port ${port} is used by current process (PID ${pid}), skipping kill`);
                  return false;
                }
                
                console.log(`[Pre-start] Found process using port ${port}: PID ${pid}`);
                
                // Try to kill the process
                try {
                  // First try graceful termination
                  execSync(`taskkill /PID ${pid} /T`, { 
                    stdio: 'ignore',
                    timeout: 3000 
                  });
                  console.log(`[Pre-start] Successfully terminated process ${pid} using port ${port}`);
                } catch (gracefulError) {
                  // If graceful fails, try force kill
                  try {
                    execSync(`taskkill /PID ${pid} /F /T`, { 
                      stdio: 'ignore',
                      timeout: 3000 
                    });
                    console.log(`[Pre-start] Successfully force-killed process ${pid} using port ${port}`);
                  } catch (killError) {
                    // Check if process doesn't exist (already dead)
                    if (killError.message && killError.message.includes('not found')) {
                      console.log(`[Pre-start] Process ${pid} already terminated`);
                    } else {
                      console.warn(`[Pre-start] Warning: Could not kill process ${pid}: ${killError.message}`);
                      return false;
                    }
                  }
                }
                
                // Give the OS a moment to release the port
                console.log(`[Pre-start] Waiting 2 seconds for port ${port} to be released...`);
                sleepSync(2000);
                return true;
              }
            }
          }
          
          // If we get here, port is not in LISTENING state (might be ESTABLISHED connections)
          console.log(`[Pre-start] Port ${port} is not in LISTENING state (may have established connections)`);
          return false;
        } catch (netstatError) {
          // Port might not be in use, which is fine
          console.log(`[Pre-start] Port ${port} is not in use (or netstat check failed)`);
          return false;
        }
      } else {
        // Unix/Linux/Mac: Use lsof
        try {
          const pids = execSync(`lsof -ti:${port}`, { 
            encoding: 'utf-8', 
            stdio: ['pipe', 'pipe', 'ignore'] 
          }).trim();
          
          if (pids) {
            const pidList = pids.split('\n').map(p => parseInt(p.trim(), 10)).filter(p => p);
            
            for (const foundPid of pidList) {
              // Don't kill current process or parent process
              if (foundPid === currentPid || foundPid === parentPid) {
                console.log(`[Pre-start] Port ${port} is used by current process (PID ${foundPid}), skipping kill`);
                continue;
              }
              
              console.log(`[Pre-start] Found process using port ${port}: PID ${foundPid}`);
              try {
                execSync(`kill -9 ${foundPid}`, { stdio: 'ignore' });
                console.log(`[Pre-start] Successfully killed process ${foundPid} using port ${port}`);
              } catch (killError) {
                console.warn(`[Pre-start] Warning: Could not kill process ${foundPid}: ${killError.message}`);
              }
            }
            
            if (pidList.length > 0) {
              // Give the OS a moment to release the port
              console.log(`[Pre-start] Waiting 2 seconds for port ${port} to be released...`);
              sleepSync(2000);
              return true;
            }
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

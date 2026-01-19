const path = require('path');
const fs = require('fs');

// Ensure logs directory exists before PM2 tries to write to it
const logsDir = path.join(__dirname, 'logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

module.exports = {
  apps: [
    {
      name: 'table-editor',
      script: path.join(__dirname, 'start-server.js'),
      cwd: __dirname,
      instances: 1,
      exec_mode: 'fork',
      env: {
        NODE_ENV: 'production',
        PORT: 3000,
      },
      error_file: path.join(__dirname, 'logs', 'pm2-error.log'),
      out_file: path.join(__dirname, 'logs', 'pm2-out.log'),
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      // Timeouts for Next.js app startup
      listen_timeout: 10000,
      kill_timeout: 5000,
      // Prevent restart loops
      min_uptime: '10s',
      max_restarts: 10,
      restart_delay: 4000,
      // Shutdown settings
      shutdown_with_message: true,
      wait_ready: false,
      // Error handling
      exp_backoff_restart_delay: 100,
    },
  ],
};


const path = require('path');
const fs = require('fs');

// Use node to run the Next.js binary directly, avoiding .bin wrapper issues
const nextBinPath = path.resolve(__dirname, 'node_modules', 'next', 'dist', 'bin', 'next.js');

module.exports = {
  apps: [
    {
      name: 'table-editor',
      script: 'node',
      args: [nextBinPath, 'start'],
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
    },
  ],
};


import http from 'node:http';
import { config } from './config/index.js';
import { createApp } from './app.js';
import { container } from './container.js';

const app = createApp();

const server = http.createServer(app);

server.listen(config.port, () =>
  console.log(
    `🚀 ${config.env.toUpperCase()} API ready on http://localhost:${config.port}`
  )
);

// Graceful shutdown
function shutDown() {
  console.log('🔄  Shutting down gracefully...');
  server.close(() => {
    container.dispose();
    console.log('✅  Closed out remaining connections');
    process.exit(0);
  });

  setTimeout(() => process.exit(1), 10_000).unref();
}

// SIGTERM - signal for graceful shutdown
process.on('SIGTERM', shutDown);
// SIGINT - signal for interrupt (Ctrl+C)
process.on('SIGINT', shutDown);

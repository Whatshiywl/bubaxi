/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { environment } from './environments/environment';
import gatewayRouter from './routes/gateway.route';
import { createDynamicProxy, initializeServiceDiscovery } from './dynamic-proxy';

const app = express();
app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    const isAllowed = environment.corsAllowedOrigins.some(entry => {
      if (typeof entry === 'string') {
        return origin === `https://${entry}` || origin.endsWith(`.${entry}`);
      }
      if (entry instanceof RegExp) {
        return entry.test(origin);
      }
      return false;
    });

    if (isAllowed) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  }
}));

app.use('/gateway', gatewayRouter);

// Initialize service discovery and setup dynamic routing
async function setupRoutes() {
  console.log('🔧 Setting up dynamic routes...');

  // Initialize service discovery
  await initializeServiceDiscovery();

  // Create dynamic proxy configuration
  const proxy = createDynamicProxy();

  // Setup proxy middleware for each route
  const routes = Object.keys(proxy);
  for (const route of routes) {
    const options = proxy[route];
    const proxyMiddleware = createProxyMiddleware(options);
    app.use(proxyMiddleware);
    console.log(`🛣️  Route configured: ${route} -> ${options.target}`);
  }

  console.log('✅ Dynamic routes setup complete');
}

const port = process.env.PORT || 3333;

// Start the server
async function startServer() {
  try {
    await setupRoutes();

    const server = app.listen(port, () => {
      console.log(`🚀 Gateway server listening on port ${port}`);
      console.log(`🌍 Environment: ${environment.production ? 'production' : 'development'}`);
    });

    server.on('error', console.error);

    // Graceful shutdown
    process.on('SIGTERM', () => {
      console.log('🛑 Received SIGTERM, shutting down gracefully');
      server.close(() => {
        console.log('👋 Server closed');
        process.exit(0);
      });
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();

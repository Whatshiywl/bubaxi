/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import express from 'express';
import cors from 'cors';
import proxy from './proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';
import { environment } from './environments/environment';

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

app.all('/gateway/webhook', (req, res) => {
  const { method, headers, query, body } = req;
  const request = { method, headers, query, body };
  console.log('req', request);
  res.send({ success: true, request });
});

app.get('/gateway', (req, res) => {
  res.send({ message: 'Welcome to gateway! :D' });
});

const routes = Object.keys(proxy);
for (const route of routes) {
  const options = proxy[route];
  const proxyMiddleware = createProxyMiddleware(options);
  app.use(proxyMiddleware);
}

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);

/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { environment } from './environments/environment';
import proxy from './proxy';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to gateway!' });
});

const routes = Object.keys(proxy);
for (const route of routes) {
  const options = proxy[route];
  const proxyMiddleware = createProxyMiddleware(route, options);
  app.use(proxyMiddleware);
}

const port = process.env.PORT || environment.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
server.on('error', console.error);

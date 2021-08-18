/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */

import * as express from 'express';
import { environment } from './environments/environment';
import { createProxyMiddleware, Options } from 'http-proxy-middleware';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';

const app = express();

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to gateway!' });
});

// Setup proxies
const proxiesDir = join(__dirname, 'proxy');
const projects = readdirSync(proxiesDir);
for (const project of projects) {
  const proxyDir = join(proxiesDir, project);
  const proxyConfs = readdirSync(proxyDir);
  for (const conf of proxyConfs) {
    const confFile = join(proxyDir, conf);
    const proxyConfJson = readFileSync(confFile).toString();
    const proxyConfs = JSON.parse(proxyConfJson) as { [route: string]: Options };
    const routes = Object.keys(proxyConfs);
    for (const route of routes) {
      const proxyConf = proxyConfs[route];
      let target = proxyConf.target as string;
      const envMatch = target.match(/{([^}]+)}/g);
      if (envMatch) {
        for (const matched of envMatch) {
          const key = matched.substring(1, matched.length - 1);
          const value = process.env[key] || environment[key];
          if (value) {
            target = target.replace(matched, value);
          }
        }
      }
      const targetURL = new URL(target);
      const basePath = targetURL.pathname;
      const newRoute = join(basePath, route);
      const newTarget = join(targetURL.origin, route);
      const rewrite = `^${basePath}`;
      const newConf = {
        target: newTarget,
        changeOrigin: proxyConf,
        secure: proxyConf.secure,
        router: proxyConf.router,
        pathRewrite: { }
      } as Options;
      newConf.pathRewrite[rewrite] = '';
      const proxy = createProxyMiddleware(newRoute, newConf);
      app.use(proxy);
    }
  }
}

const port = process.env.PORT || environment.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at port ${port}`);
});
server.on('error', console.error);

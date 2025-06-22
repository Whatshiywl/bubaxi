import { environment } from './environments/environment';
import * as debugAgent from '@google-cloud/debug-agent';
if (environment.production) {
  debugAgent.start();
}

import * as express from 'express';
import zapRouter from './app/zap.router';
import quintoRouter from './app/quinto.router';

const app = express();

app.use(express.json());

app.get('/api', (req, res) => {
  res.send({ message: 'Welcome to quintozap-api!' });
});

app.get('/api/googlemapsapikey', (_, res) => {
  res.send(process.env.MAPS_API_KEY || '');
});

app.use('/api/zap', zapRouter);
app.use('/api/quinto', quintoRouter);

const port = process.env.PORT || 3020;
const server = app.listen(port, () => {
  console.log(`quintozap-api listening at ${port}`);
});
server.on('error', console.error);

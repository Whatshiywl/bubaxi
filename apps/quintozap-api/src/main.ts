import { environment } from './environments/environment';
import * as debugAgent from '@google-cloud/debug-agent';
if (environment.production) {
  debugAgent.start();
}

import * as express from 'express';
import zapRouter from './app/zap.router';
import quintoRouter from './app/quinto.router';
import rootRouter from './app/root.router';

const app = express();

app.use(express.json());

app.use('/zap', zapRouter);
app.use('/quinto', quintoRouter);
app.use('/', rootRouter);

const port = process.env.PORT || 3020;
const server = app.listen(port, () => {
  console.log(`quintozap-api listening at ${port}`);
});
server.on('error', console.error);

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

const port = process.env.PORT || 3333;
const server = app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}/api`);
});
server.on('error', console.error);

import { Router, Request } from 'express';
import { GatewayHelloResponse, WebhookResponse } from '@bubaxi/api-types';

export const gatewayRouter = Router();

gatewayRouter.all('/webhook', (req, res) => {
  const handlerResponse = webhookHandler(req);
  res.send(handlerResponse);
});

gatewayRouter.get('/', (_, res) => {
  const handlerResponse = helloHandler();
  res.send(handlerResponse);
});

function webhookHandler(req: Request): WebhookResponse {
  const { method, headers, query, body } = req;
  const request = { method, headers, query, body };
  console.log('req', request);
  return { success: true, request };
}

function helloHandler(): GatewayHelloResponse {
  return { message: 'Welcome to gateway! :D' };
}

export default gatewayRouter;

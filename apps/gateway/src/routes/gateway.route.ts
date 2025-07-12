import { Router, Request } from 'express';
import { GatewayHelloResponse, WebhookResponse } from '@bubaxi/api-types';
import { serviceDiscovery } from '../dynamic-proxy';

export const gatewayRouter = Router();

gatewayRouter.all('/webhook', (req, res) => {
  const handlerResponse = webhookHandler(req);
  res.send(handlerResponse);
});

gatewayRouter.get('/', (_, res) => {
  const handlerResponse = helloHandler();
  res.send(handlerResponse);
});

// Health check endpoint showing discovered services
gatewayRouter.get('/health', async (_, res) => {
  try {
    const services = await serviceDiscovery.getAvailableServices();
    const allServiceUrls = serviceDiscovery.getAllServiceUrls();
    const isCloudMode = serviceDiscovery.isInCloudMode();

    res.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      mode: isCloudMode ? 'cloud' : 'local',
      environment: {
        PROJECT_ID: process.env.PROJECT_ID || 'not set',
        REGION: process.env.REGION || 'not set',
        EXPECTED_API_SERVICES: process.env.EXPECTED_API_SERVICES || 'not set'
      },
      services: {
        discovered: services.length,
        available: services.filter(s => s.status === 'available').length,
        list: services
      },
      routes: Object.fromEntries(allServiceUrls)
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message,
      timestamp: new Date().toISOString()
    });
  }
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

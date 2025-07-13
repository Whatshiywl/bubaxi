import { Router } from 'express';
import { QuintozapGoogleMapsApiKeyResponse, QuintozapHelloResponse } from '@bubaxi/api-types';
const router = Router();

router.get('/', (_, res) => {
  const response = helloHandler();
  res.send(response);
});

router.get('/googlemapsapikey', (_, res) => {
  const response = googleMapsApiKeyHandler();
  res.send(response);
});

function helloHandler(): QuintozapHelloResponse {
  return { message: 'Welcome to quintozap-api! :D' };
}

function googleMapsApiKeyHandler(): QuintozapGoogleMapsApiKeyResponse {
  return { apiKey: process.env.GOOGLE_MAPS_API_KEY || '' };
}

export default router;

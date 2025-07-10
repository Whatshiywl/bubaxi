import { Request } from "express";

export interface WebhookResponse {
  success: boolean;
  request: Pick<Request, 'method' | 'headers' | 'query' | 'body'>;
}

export interface GatewayHelloResponse {
  message: string;
}

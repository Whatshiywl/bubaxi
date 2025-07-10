import { Injectable, isDevMode } from '@angular/core';

export interface HttpClientConfig {
  baseUrl: string;
  servicePath: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpClientConfigService {
  private readonly baseUrl: string;

  constructor() {
    this.baseUrl = isDevMode()
      ? 'http://localhost:3333'
      : 'https://api.bubaxi.com';
  }

  getConfig(servicePath: string): HttpClientConfig {
    return {
      baseUrl: this.baseUrl,
      servicePath
    };
  }

  buildUrl(servicePath: string, path: string = ''): string {
    const cleanPath = path.startsWith('/') || path === '' ? path : `/${path}`;
    return `${this.baseUrl}/${servicePath}${cleanPath}`;
  }
}

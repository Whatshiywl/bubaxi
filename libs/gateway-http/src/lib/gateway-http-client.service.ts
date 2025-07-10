import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, of } from "rxjs";
import { GatewayHelloResponse } from '@bubaxi/api-types';
import { BaseHttpClient } from './base-http-client';
import { HttpClientConfigService } from './http-client-config.service';

@Injectable()
export class GatewayHttpClient extends BaseHttpClient {
  protected readonly servicePath = 'gateway';

  constructor(
    http: HttpClient,
    configService: HttpClientConfigService
  ) {
    super(http, configService);
  }

  getGatewayHello() {
    return this.get<GatewayHelloResponse>('')
      .pipe(catchError(err => {
        console.error(err);
        return of();
      }));
  }

}

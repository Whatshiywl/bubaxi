import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, of } from "rxjs";
import { HomaxiHelloResponse } from '@bubaxi/api-types';
import { BaseHttpClient } from './shared/base-http-client';
import { HttpClientConfigService } from './shared/http-client-config.service';

@Injectable()
export class HomaxiHttpClient extends BaseHttpClient {
  protected readonly servicePath = 'homaxi';

  constructor(
    http: HttpClient,
    configService: HttpClientConfigService
  ) {
    super(http, configService);
  }

  getHello() {
    return this.get<HomaxiHelloResponse>('')
      .pipe(catchError(err => {
        console.error(err);
        return of();
      }));
  }

}

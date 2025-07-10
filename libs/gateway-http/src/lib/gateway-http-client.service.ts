import { Injectable, isDevMode } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { catchError, of } from "rxjs";
import { GatewayHelloResponse } from '@bubaxi/api-types';

@Injectable()
export class GatewayHttpClient {
  private baseApiUrl: string;

  constructor(
    private http: HttpClient
  ) {
    this.baseApiUrl = isDevMode() ?
      'http://localhost:3333' :
      'https://api.bubaxi.com';
  }

  getGatewayHello() {
    return this.http.get<GatewayHelloResponse>(`${this.baseApiUrl}/gateway`)
      .pipe(catchError(err => {
        console.error(err);
        return of();
      }));
  }

}

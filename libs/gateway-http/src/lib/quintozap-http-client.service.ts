import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { catchError, of, throwError } from "rxjs";
import { QuintoandarListingResponse, QuintoandarListingsResponse, QuintozapGoogleMapsApiKeyResponse, QuintozapHelloResponse, ZapListing, ZapListingsResponse } from '@bubaxi/api-types';
import { BaseHttpClient } from './shared/base-http-client';
import { HttpClientConfigService } from './shared/http-client-config.service';

@Injectable()
export class QuintozapHttpClient extends BaseHttpClient {
  protected readonly servicePath = 'quintozap';

  constructor(
    http: HttpClient,
    configService: HttpClientConfigService
  ) {
    super(http, configService);
  }

  getHello() {
    return this.get<QuintozapHelloResponse>('')
      .pipe(catchError(err => {
        console.error(err);
        return of();
      }));
  }

  getGoogleMapsApiKey() {
    return this.get<QuintozapGoogleMapsApiKeyResponse>('/googlemapsapikey')
      .pipe(catchError(err => {
        console.error(err);
        return of({ apiKey: '' });
      }));
  }

  getZapListings(params: HttpParams) {
    return this.get<ZapListingsResponse>(`/zap/listings?${params.toString()}`)
      .pipe(catchError(err => {
        console.error(err);
        return of({ search: { result: { listings: [], totalCount: 0 } } } as ZapListingsResponse);
      }));
  }

  getQuintoandarListings(filter: any) {
    return this.post<QuintoandarListingsResponse>(`/quinto/listings`, filter)
      .pipe(catchError(err => {
        console.error(err);
        return throwError(() => new Error('Failed to fetch Quintoandar listings'));
      }));
  }

  getQuintoandarListing(id: string) {
    return this.get<QuintoandarListingResponse>(`/quinto/listings/${id}`)
      .pipe(catchError(err => {
        console.error(err);
        return throwError(() => new Error(`Failed to fetch Quintoandar listing with ID ${id}`));
      }));
  }

}

import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { HttpClientConfigService } from './http-client-config.service';

export abstract class BaseHttpClient {
  protected abstract readonly servicePath: string;

  constructor(
    protected http: HttpClient,
    protected configService: HttpClientConfigService
  ) {}

  protected buildUrl(path: string = ''): string {
    return this.configService.buildUrl(this.servicePath, path);
  }

  protected get<T>(path: string): Observable<T> {
    return this.http.get<T>(this.buildUrl(path));
  }

  protected post<T>(path: string, body: any): Observable<T> {
    return this.http.post<T>(this.buildUrl(path), body);
  }

  protected put<T>(path: string, body: any): Observable<T> {
    return this.http.put<T>(this.buildUrl(path), body);
  }

  protected delete<T>(path: string): Observable<T> {
    return this.http.delete<T>(this.buildUrl(path));
  }

  protected patch<T>(path: string, body: any): Observable<T> {
    return this.http.patch<T>(this.buildUrl(path), body);
  }
}

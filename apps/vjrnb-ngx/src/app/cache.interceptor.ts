import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of } from "rxjs";
import { tap, share } from 'rxjs/operators';
import * as NodeCache from 'node-cache';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private nCache: NodeCache = new NodeCache({
    stdTTL: 3600
  });

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.method !== "GET") {
      return next.handle(req);
    }
    const cacheId = `${req.urlWithParams}`;
    const cachedResponse: HttpResponse<any> | undefined = this.nCache.get(cacheId);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    } else {
      return next.handle(req).pipe(
        tap(stateEvent => {
          if(stateEvent instanceof HttpResponse) {
            this.nCache.set(cacheId, stateEvent.clone());
          }
        }),
        share()
      );
    }
  }
}

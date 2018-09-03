import {Injectable} from '@angular/core';
import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import * as NodeCache from 'node-cache';
import {tap} from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements HttpInterceptor {
  private cache: NodeCache;

  constructor() {
    this.cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    if (request.method !== 'GET') {
      return next.handle(request);
    }
    const cachedResponse = this.cache.get(request.urlWithParams);
    return this.sendAndCache(request, next);
    // return cachedResponse ? of(cachedResponse) : this.sendAndCache(request, next);
  }

  private sendAndCache(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          this.cache.set(request.urlWithParams, event);
        }
      })
    );
  }
}

import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map, share} from 'rxjs/operators';
import {BungieResponse} from './bungie.model';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('www.bungie.net') === -1) {
      return next.handle(request);
    }
    request = request.clone({
      headers: request.headers.set('X-API-Key', '00503d2de9d14b17b5baed537fe29ab4')
    });
    return next.handle(request).pipe(
      filter(event => event instanceof HttpResponse && event.url.indexOf('https://www.bungie.net') > -1),
      share(),
      map((rsp: HttpResponse<BungieResponse<any>>) => rsp.clone({ body: rsp.body.Response }))
    );
  }
}

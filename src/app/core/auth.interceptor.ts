import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map, share, tap} from 'rxjs/operators';
import {BungieResponse} from './bungie.model';
import {BungieErrorCode} from './bungie.enums';
import {environment} from '../../environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('www.bungie.net') === -1) {
      return next.handle(request);
    }
    const auth = this.authHeader;

    request = request.clone({
      setHeaders: {
        'X-API-Key': environment.apiKey,
        ...(auth && { 'Authorization': auth })
      }
    });
    return next.handle(request).pipe(
      filter(event => event instanceof HttpResponse && event.url.indexOf('https://www.bungie.net') > -1),
      share(),
      map((rsp: HttpResponse<BungieResponse<any>>) => rsp.clone({ body: rsp.body.Response })),
      tap((rsp: HttpResponse<BungieResponse<any>>) => {
        if (rsp.body.ErrorCode === BungieErrorCode.WebAuthRequired) {
          location.href = 'https://www.bungie.net/en/OAuth/Authorize?client_id=1853&response_type=code';
        }
      })
    );
  }

  private get authHeader(): string {
    const authStorageValue = localStorage.getItem('auth');
    const ttlAuth = authStorageValue ? JSON.parse(authStorageValue) : null;
    const auth = ttlAuth ? ttlAuth.value : null;
    return auth ? `${auth.token_type} ${auth.access_token}` : null;
  }
}

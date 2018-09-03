import {HttpEvent, HttpHandler, HttpHeaders, HttpInterceptor, HttpRequest, HttpResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {filter, map, share, tap} from 'rxjs/operators';
import {BungieResponse, TokenResponse} from './bungie.model';
import {BungieErrorCode} from './bungie.enums';

export const apiKey = '603cfd09f8774361a731d7a93da979df'; // local
// export const apiKey = '00503d2de9d14b17b5baed537fe29ab4'; // prod

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor() {}

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.indexOf('www.bungie.net') === -1) {
      return next.handle(request);
    }
    request = request.clone({
      headers: this.getHeaders(request)
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

  private getHeaders(request: HttpRequest<any>): HttpHeaders {
    const maybeAuth = this.authHeader;
    const headers = request.headers.set('X-API-Key', apiKey);
    if (maybeAuth) {
      headers.set('Authorization', maybeAuth);
    }
    return headers;
  }

  private get authHeader(): string {
    const authStorageValue = localStorage.getItem('auth');
    if (authStorageValue) {
      const auth: TokenResponse = JSON.parse(authStorageValue);
      return `${auth.token_type} ${auth.access_token}`;
    }
    return null;
  }
}

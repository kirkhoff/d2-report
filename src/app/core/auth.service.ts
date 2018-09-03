import {Injectable} from '@angular/core';
import {CoreModule} from './core.module';
import {bungie, clientId} from './bungie.service';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {TokenResponse} from './bungie.model';
import {HttpClient} from '@angular/common/http';
import {MatDialog} from '@angular/material';

interface TtlAuthStorage {
  value: TokenResponse;
  timestamp: number;
}

@Injectable({
  providedIn: CoreModule
})
export class AuthService {
  readonly tokenRequestUrl = `${bungie}/en/OAuth/Authorize?client_id=${clientId}&response_type=code`;

  constructor(private dialog: MatDialog, private http: HttpClient) {}

  requestToken(): void {
    const currentLocation = location.href;
    localStorage.setItem('authRedirect', currentLocation);
    location.replace(this.tokenRequestUrl);
  }

  authenticate(authCode: string): Observable<TokenResponse> {
    const url = `${bungie}/Platform/App/OAuth/Token/`;
    const body = `client_id=${clientId}&grant_type=authorization_code&code=${authCode}`;
    return this.http.post<TokenResponse>(url, body, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
  }

  authenticateAndRedirect(code: string): void {
    this.authenticate(code).pipe(
      tap(auth => this.auth = auth)
    ).subscribe(() => setTimeout(() => location.replace(this.authRedirect)));
  }

  get isAuthenticated() {
    return !!this.auth;
  }

  get membershipId(): string {
    const auth = this.auth;
    return auth ? auth.membership_id : null;
  }

  private get auth(): TokenResponse {
    const authStorageValue = localStorage.getItem('auth');
    const ttlAuth: TtlAuthStorage = authStorageValue ? JSON.parse(authStorageValue) : null;
    const now = Date.now();
    const expiresAt = (ttlAuth  && ttlAuth.value && ttlAuth.value.expires_in) ? (now + ttlAuth.value.expires_in) : 0;
    const expired = (ttlAuth && ttlAuth.timestamp) && (expiresAt < ttlAuth.timestamp);

    if (expired) {
      localStorage.removeItem('auth');
    }

    return ttlAuth && !expired ? ttlAuth.value : null;
  }

  private set auth(value: TokenResponse) {
    const ttlAuth: TtlAuthStorage = {
      value,
      timestamp: Date.now()
    };
    localStorage.setItem('auth', JSON.stringify(ttlAuth));
  }

  private get authRedirect(): string {
    return localStorage.getItem('authRedirect') || '/';
  }
}

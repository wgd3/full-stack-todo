import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TOKEN_STORAGE_KEY } from '@fst/client/util';
import {
  IAccessTokenPayload,
  ILoginPayload,
  ITokenResponse,
} from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import * as jwt_decode from 'jwt-decode';
import { BehaviorSubject, Observable, share, take, tap } from 'rxjs';
import { handleApiError } from './handle-api-error-response';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  private accessToken$$ = new BehaviorSubject<string | null>(null);
  private userData$$ = new BehaviorSubject<IAccessTokenPayload | null>(null);

  /**
   * The encoded token is stored so that it can be used by an interceptor
   * and injected as a header
   */
  accessToken$ = this.accessToken$$.pipe(share());

  /**
   * Data from the decoded JWT including a user's ID and email address
   */
  userData$ = this.userData$$.pipe();

  setToken(val: string) {
    this.accessToken$$.next(val);
    localStorage.setItem(TOKEN_STORAGE_KEY, val);
  }

  clearToken() {
    this.accessToken$$.next(null);
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  }

  loadToken() {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    console.log(`[AuthService] Loaded token: ${token?.slice(0, 12)}`);
    if (token) {
      this.accessToken$$.next(token);
      this.userData$$.next(this.decodeToken(token));
    }
  }

  loginUser(data: ILoginPayload): Observable<ITokenResponse> {
    console.log(`[AuthService] Logging in`, data);
    return this.http
      .post<ITokenResponse>(`${this.baseUrl}/auth/login`, data, httpOptions)
      .pipe(
        take(1),
        tap(({ access_token }) => {
          this.setToken(access_token);
          this.userData$$.next(this.decodeToken(access_token));
        }),
        share(),
        handleApiError
      );
  }

  logoutUser() {
    this.clearToken();
    this.userData$$.next(null);
  }

  /**
   * Compares the `exp` field of a token to the current time. Returns
   * a boolean with a 5 sec grace period.
   */
  isTokenExpired(): boolean {
    const expiryTime = this.userData$$.value?.['exp'];
    console.log(`[AuthService] Checking for token expiration...`);
    if (expiryTime) {
      const expireTs = 1000 * +expiryTime;
      const now = new Date().getTime();
      console.log(
        `[AuthService] Time left to expiration: ${Math.round(
          (expireTs - now) / 1000
        )} seconds`
      );
      return expireTs - now <= 0;
    }
    console.log(
      `[AuthService] No expiration time found! Setting expired to true`
    );
    return true;
  }

  private decodeToken(token: string | null): IAccessTokenPayload | null {
    if (token) {
      return jwt_decode.default(token) as IAccessTokenPayload;
    }
    return null;
  }
}

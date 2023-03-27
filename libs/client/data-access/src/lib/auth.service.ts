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
import { BehaviorSubject, Observable, tap } from 'rxjs';

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
  accessToken$ = this.accessToken$$.pipe();

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
    console.log(`JwtTokenService#loadToken`);
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    console.log(`JwtTokenService#loadToken - token: ${token}`);
    if (token) {
      this.accessToken$$.next(token);
    }
  }

  loginUser(data: ILoginPayload): Observable<ITokenResponse> {
    return this.http
      .post<ITokenResponse>(`${this.baseUrl}/auth/login`, data)
      .pipe(
        tap(({ access_token }) => {
          this.setToken(access_token);
          this.userData$$.next(this.decodeToken(access_token));
        })
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
    if (expiryTime) {
      return 1000 * +expiryTime - new Date().getTime() < 5000;
    }
    return false;
  }

  private decodeToken(token: string | null): IAccessTokenPayload | null {
    if (token) {
      return jwt_decode.default(token) as IAccessTokenPayload;
    }
    return null;
  }
}

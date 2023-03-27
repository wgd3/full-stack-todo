import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TOKEN_STORAGE_KEY } from '@fst/client/util';
import { ILoginPayload, ITokenResponse } from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;
  private accessToken$$ = new BehaviorSubject<string | null>(null);

  accessToken$ = this.accessToken$$.pipe();

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
        })
      );
  }

  logoutUser() {
    this.clearToken();
  }
}

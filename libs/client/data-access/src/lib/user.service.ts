import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ILoginPayload, ITokenResponse } from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { Observable, tap } from 'rxjs';
import { JwtTokenService } from './jwt-token.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly http = inject(HttpClient);
  private readonly tokenService = inject(JwtTokenService);
  private readonly baseUrl = environment.apiUrl;

  loginUser(data: ILoginPayload): Observable<ITokenResponse> {
    return this.http
      .post<ITokenResponse>(`${this.baseUrl}/auth/login`, data)
      .pipe(
        tap(({ access_token }) => {
          this.tokenService.setToken(access_token);
        })
      );
  }

  logoutUser() {
    this.tokenService.clearToken();
  }
}

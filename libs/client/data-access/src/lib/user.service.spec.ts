import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ILoginPayload, ITokenResponse } from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { of, switchMap, tap } from 'rxjs';
import { JwtTokenService, TOKEN_STORAGE_KEY } from './jwt-token.service';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let jwtService: JwtTokenService;
  let http: HttpClient;

  const baseUrl = environment.apiUrl;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpClient);
    jwtService = TestBed.inject(JwtTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should login a user', (done) => {
    const token: ITokenResponse = {
      access_token: '',
    };
    const loginPayload: ILoginPayload = {
      email: '',
      password: '',
    };
    const httpSpy = jest.spyOn(http, 'post').mockReturnValue(of(token));
    service
      .loginUser(loginPayload)
      .pipe(
        tap((val) => {
          expect(val).toStrictEqual(token);
          expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toStrictEqual(
            token.access_token
          );
        }),
        switchMap(() => jwtService.accessToken$),
        tap((val) => {
          expect(val).toStrictEqual(token.access_token);
        })
      )
      .subscribe({
        next: () => {
          done();
        },
      });
    expect(httpSpy).toHaveBeenCalledWith(`${baseUrl}/auth/login`, loginPayload);
  });

  it('should log out a user', (done) => {
    jwtService.setToken('secret');
    service.logoutUser();
    jwtService.accessToken$.subscribe({
      next: (val) => {
        expect(val).toBeNull();
        expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
        done();
      },
      error: done.fail,
    });
  });

  afterEach(() => {
    jwtService.clearToken();
  });
});

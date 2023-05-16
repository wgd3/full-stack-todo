import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TOKEN_STORAGE_KEY } from '@fst/client/util';
import { ITokenResponse, SocialProviderEnum } from '@fst/shared/domain';
import { randEmail } from '@ngneat/falso';
import { of } from 'rxjs';

import { AuthService } from './auth.service';

const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhbGxhY2UyQHRoZWZ1bGxzdGFjay5lbmdpbmVlciIsInN1YiI6ImE5ZjdkOTExLTExNWUtNDRkYy04NjNhLWQyM2MyOGJlMDJkNSIsImlhdCI6MTY3OTkzMzkzNiwiZXhwIjoxNjc5OTM0NTM2fQ.J5NFi_zaSYTYiplDn05OXx0f6gMWWHw7Ki7Hw7kKp3U';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        {
          provide: SocialAuthService,
          useValue: {},
        },
      ],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update localStorage when setting a token', (done) => {
    service.setToken(SocialProviderEnum.email, 'foo');
    service.accessToken$.subscribe({
      next: (token) => {
        expect(token).toEqual('foo');
        expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toEqual('foo');
        done();
      },
      error: done.fail,
    });
  });

  it('should update localStorage when clearing a token', (done) => {
    service.clearToken();
    service.accessToken$.subscribe({
      next: (token) => {
        expect(token).toBeNull();
        expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
        done();
      },
      error: done.fail,
    });
  });

  it('should load a token from localStorage', (done) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, EXPIRED_TOKEN);
    service.loadToken();
    service.accessToken$.subscribe({
      next: (val) => {
        expect(val).toStrictEqual(EXPIRED_TOKEN);
        done();
      },
      error: done.fail,
    });
  });

  it('should login a user', (done) => {
    const resp: ITokenResponse = {
      access_token: '',
    };
    const spy = jest.spyOn(http, 'post').mockReturnValue(of(resp));
    service.loginUserByEmail({ email: randEmail(), password: '' }).subscribe({
      next: ({ access_token }) => {
        expect(access_token).toStrictEqual('');
        done();
      },
      error: done.fail,
    });
  });

  it('should clear storage on log out', (done) => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhbGxhY2VAdGhlZnVsbHN0YWNrLmVuZ2luZWVyIiwic3ViIjoiYmQ0ZTNmOTEtMDUxZC00NGU4LTgyMDQtZmY4YjFjYzk1OTU3IiwiaWF0IjoxNjgwMDE0MDQwLCJleHAiOjE2ODAwMTQ2NDB9.LdH-sN9IXD78P9z78a8k__70zS6FFqOenpiNrJ6eifg';
    service.setToken(SocialProviderEnum.email, token);
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toStrictEqual(token);

    service.logoutUser();
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toBeNull();
    done();
  });

  it('should detect an expired token', (done) => {
    const token =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhbGxhY2VAdGhlZnVsbHN0YWNrLmVuZ2luZWVyIiwic3ViIjoiYmQ0ZTNmOTEtMDUxZC00NGU4LTgyMDQtZmY4YjFjYzk1OTU3IiwiaWF0IjoxNjgwMDE0MDQwLCJleHAiOjE2ODAwMTQ2NDB9.LdH-sN9IXD78P9z78a8k__70zS6FFqOenpiNrJ6eifg';
    service.setToken(SocialProviderEnum.email, token);
    expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toStrictEqual(token);
    service.loadToken();

    expect(service.isTokenExpired()).toStrictEqual(true);
    done();
  });

  it('should say a token is expired when one is not loaded', (done) => {
    expect(service.isTokenExpired()).toStrictEqual(true);
    done();
  });

  afterEach(() => {
    service.clearToken();
  });
});

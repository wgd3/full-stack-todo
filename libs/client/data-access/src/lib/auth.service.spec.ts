import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { TOKEN_STORAGE_KEY } from '@fst/client/util';

import { AuthService } from './auth.service';

const EXPIRED_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IndhbGxhY2UyQHRoZWZ1bGxzdGFjay5lbmdpbmVlciIsInN1YiI6ImE5ZjdkOTExLTExNWUtNDRkYy04NjNhLWQyM2MyOGJlMDJkNSIsImlhdCI6MTY3OTkzMzkzNiwiZXhwIjoxNjc5OTM0NTM2fQ.J5NFi_zaSYTYiplDn05OXx0f6gMWWHw7Ki7Hw7kKp3U';

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpClient;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update localStorage when setting a token', (done) => {
    service.setToken('foo');
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

  afterEach(() => {
    service.clearToken();
  });
});

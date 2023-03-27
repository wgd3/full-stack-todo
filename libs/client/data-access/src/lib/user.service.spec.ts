import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ILoginPayload, ITokenResponse } from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { of } from 'rxjs';
import { JwtTokenService } from './jwt-token.service';

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
    service.loginUser(loginPayload).subscribe({
      next: (val) => {
        expect(val).toStrictEqual(token);
        done();
      },
      error: done.fail,
    });
    expect(httpSpy).toHaveBeenCalledWith(`${baseUrl}/auth/login`, loginPayload);
  });

  it('should log out a user', (done) => {
    jwtService.setToken('secret');
    service.logoutUser();
    jwtService.accessToken$.subscribe({
      next: (val) => {
        expect(val).toBeNull();
        done();
      },
      error: done.fail,
    });
  });

  afterEach(() => {
    jwtService.clearToken();
  });
});

import { HttpClient } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { ICreateUser, IPublicUserData } from '@fst/shared/domain';
import { environment } from '@fst/shared/util-env';
import { randEmail, randPassword, randUuid } from '@ngneat/falso';
import { of } from 'rxjs';

import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let http: HttpClient;

  const baseUrl = `${environment.apiUrl}/users`;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(UserService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return a user', (done) => {
    const resp: IPublicUserData = {
      id: randUuid(),
      email: randEmail(),
      todos: [],
      familyName: null,
      givenName: null,
      profilePicture: null,
      socialProvider: null,
      socialId: null,
    };
    const spy = jest.spyOn(http, 'get').mockReturnValue(of(resp));
    service.getUser(resp.id).subscribe({
      next: (user) => {
        expect(user).toStrictEqual(resp);
        expect(spy).toHaveBeenCalledWith(`${baseUrl}/${resp.id}`);
        done();
      },
      error: done.fail,
    });
  });

  it('should update a user', (done) => {
    const resp: IPublicUserData = {
      id: randUuid(),
      email: randEmail(),
      todos: [],
      familyName: null,
      givenName: null,
      profilePicture: null,
      socialProvider: null,
      socialId: null,
    };
    const spy = jest.spyOn(http, 'patch').mockReturnValue(of(resp));
    service.updateUser(resp.id, { email: resp.email }).subscribe({
      next: (user) => {
        expect(user).toStrictEqual(resp);
        expect(spy).toHaveBeenCalledWith(`${baseUrl}/${resp.id}`, {
          email: resp.email,
        });
        done();
      },
      error: done.fail,
    });
  });

  it('should create a user', (done) => {
    const resp: IPublicUserData = {
      id: randUuid(),
      email: randEmail(),
      todos: [],
      familyName: null,
      givenName: null,
      profilePicture: null,
      socialProvider: null,
      socialId: null,
    };
    const payload: ICreateUser = {
      email: randEmail(),
      password: randPassword(),
      familyName: null,
      givenName: null,
      profilePicture: null,
      socialProvider: null,
      socialId: null,
    };
    const spy = jest.spyOn(http, 'post').mockReturnValue(of(resp));
    service.createUser(payload).subscribe({
      next: (user) => {
        expect(user).toStrictEqual(resp);
        expect(spy).toHaveBeenCalledWith(`${baseUrl}`, payload);
        done();
      },
      error: done.fail,
    });
  });
});

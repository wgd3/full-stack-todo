import { TestBed } from '@angular/core/testing';
import { TOKEN_STORAGE_KEY } from '@fst/client/util';

import { JwtTokenService } from './jwt-token.service';

describe('UserService', () => {
  let service: JwtTokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
    });
    service = TestBed.inject(JwtTokenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should update BehaviorSubject with new token', (done) => {
    service.setToken('secret');
    service.accessToken$.subscribe({
      next: (token) => {
        expect(token).toBe('secret');
        expect(localStorage.getItem(TOKEN_STORAGE_KEY)).toStrictEqual('secret');
        done();
      },
      error: done.fail,
    });
  });

  afterEach(() => {
    localStorage.clear();
  });
});

import {
  HttpClient,
  HttpInterceptorFn,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth.service';
import { jwtInterceptor } from './jwt.interceptor';

class MockAuthService {
  accessToken$ = new BehaviorSubject<string>('foo');
}

describe('jwtInterceptor', () => {
  let authService: AuthService;
  let http: HttpClient;

  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => jwtInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        provideHttpClient(withInterceptors([jwtInterceptor])),
        provideHttpClientTesting(),
        {
          provide: AuthService,
          useClass: MockAuthService,
        },
      ],
    });
    authService = TestBed.inject(AuthService);
    http = TestBed.inject(HttpClient);
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });

  it('should add an Authorization header', (done) => {
    TestBed.inject(HttpClient)
      .get('/test', { responseType: 'text' })
      .subscribe(() => done());
    const req = TestBed.inject(HttpTestingController).expectOne('/test');

    req.flush('');
    expect(req.request.headers.get('Authorization')).toEqual('Bearer foo');
  });
});

import { SocialAuthService } from '@abacritt/angularx-social-login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../auth.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  let router: Router;
  let auth: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        {
          provide: SocialAuthService,
          useValue: {},
        },
      ],
      imports: [
        RouterTestingModule.withRoutes([
          {
            path: 'login',
            redirectTo: '',
          },
        ]),
        HttpClientTestingModule,
      ],
    });

    router = TestBed.inject(Router);
    auth = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true when a token is valid', () => {
    jest.spyOn(auth, 'isTokenExpired').mockReturnValue(false);
    expect(
      executeGuard(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{
        url: 'testUrl',
      })
    ).toBe(true);
  });

  it('should return false when a token is invalid', () => {
    jest.spyOn(auth, 'isTokenExpired').mockReturnValue(true);
    const routerSpy = jest.spyOn(router, 'navigate');
    expect(
      executeGuard(new ActivatedRouteSnapshot(), <RouterStateSnapshot>{
        url: 'testUrl',
      })
    ).toEqual(false);
    expect(routerSpy).toHaveBeenCalled();
  });
});

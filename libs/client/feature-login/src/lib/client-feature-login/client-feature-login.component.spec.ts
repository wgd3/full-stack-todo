import {
  GoogleSigninButtonModule,
  SocialAuthService,
} from '@abacritt/angularx-social-login';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthService } from '@fst/client/data-access';
import { EMPTY, of, throwError } from 'rxjs';
import { ClientFeatureLoginComponent } from './client-feature-login.component';

describe('ClientFeatureLoginComponent', () => {
  let component: ClientFeatureLoginComponent;
  let fixture: ComponentFixture<ClientFeatureLoginComponent>;
  let router: Router;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ClientFeatureLoginComponent,
        HttpClientTestingModule,
        GoogleSigninButtonModule,
      ],
      providers: [
        {
          provide: AuthService,
          useValue: {
            loginUserByEmail: () => of({ access_token: null }),
          },
        },
        {
          provide: SocialAuthService,
          useValue: {
            // needed by the GoogleSignInButtonDirective
            initState: EMPTY,
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ClientFeatureLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    router = TestBed.inject(Router);
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('form submission', () => {
    it('should clear out any existing error messages on submit', () => {
      component.errorMessage$.next(`foo`);
      component.loginForm.setValue(
        { email: 'foo@bar.com', password: `Password1!` },
        { emitEvent: true }
      );
      component.loginForm.markAsDirty();
      component.submitForm();
      expect(component.errorMessage$.value).toBeNull();
    });

    it('should navigate to the dashboard on successful login', () => {
      const routerSpy = jest.spyOn(router, 'navigate');
      component.loginForm.setValue(
        { email: 'foo@bar.com', password: `Password1!` },
        { emitEvent: true }
      );
      component.loginForm.markAsDirty();
      component.submitForm();

      expect(routerSpy).toHaveBeenCalledWith(['/']);
    });

    it('should update the error message on a failed attempt', () => {
      const spy = jest
        .spyOn(authService, 'loginUserByEmail')
        .mockImplementation(() => {
          return throwError(
            () => new HttpErrorResponse({ error: { message: 'foo' } })
          );
        });
      component.loginForm.setValue(
        { email: 'foo@bar.com', password: `Password1!` },
        { emitEvent: true }
      );
      component.loginForm.markAsDirty();
      component.submitForm();
      expect(component.errorMessage$.value).toEqual(`foo`);
    });

    it('should handle non-HttpErrorResponse errors', () => {
      const spy = jest
        .spyOn(authService, 'loginUserByEmail')
        .mockImplementation(() => {
          return throwError(() => new Error());
        });
      component.loginForm.setValue(
        { email: 'foo@bar.com', password: `Password1!` },
        { emitEvent: true }
      );
      component.loginForm.markAsDirty();
      component.submitForm();
      expect(component.errorMessage$.value?.startsWith(`Unknown`)).toBe(true);
    });
  });
});

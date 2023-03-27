import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap } from 'rxjs';
import { AuthService } from '../auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return authService.accessToken$.pipe(
    map((token) => {
      console.log(`[jwtInterceptor] token: ${token}`);
      if (token) {
        req = req.clone({
          url: req.url,
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
      }
      return req;
    }),
    switchMap((req) => next(req))
  );
};

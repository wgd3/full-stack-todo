import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap, take } from 'rxjs';
import { AuthService } from '../auth.service';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  return authService.accessToken$.pipe(
    take(1),
    map((token) => {
      console.log(`[jwtInterceptor] token: ${token?.slice(0, 12)}`);
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

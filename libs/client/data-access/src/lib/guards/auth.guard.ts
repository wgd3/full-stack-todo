import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expired = authService.isTokenExpired();
  console.log(`[AuthGuard] token expired: ${expired}`);
  if (expired) {
    router.navigate([`/login`], { queryParams: { returnUrl: state.url } });
    return false;
  }
  return true;
};

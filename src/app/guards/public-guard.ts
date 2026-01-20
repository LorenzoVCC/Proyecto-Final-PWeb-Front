import { inject, Inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Auth } from '../services/auth-service';

export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth)
  const router = inject(Router);

  if (authService.isLogged) {
    const redirectPath = router.parseUrl("/");
    return new RedirectCommand(redirectPath, {
      skipLocationChange: true,
    });
  }
  return true;
};

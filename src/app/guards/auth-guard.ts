import { inject } from '@angular/core';
import { CanActivateChildFn, RedirectCommand, Router } from '@angular/router';
import { Auth } from '../services/auth-service';

export const authGuard: CanActivateChildFn = (childRoute, state) => {
  const authService = inject(Auth);
  const router = inject(Router);

  if(authService.isLogged) return true;

  router.navigate(['/login']);
  return false;
};

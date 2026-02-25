import { inject } from '@angular/core';
import { CanActivateFn, RedirectCommand, Router } from '@angular/router';
import { Auth } from '../services/auth-service';


export const ownerGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  
  if (!auth.token) 
  {
    router.navigate(['/login']);
    return false;
  }

  const restaurantId = Number(route.paramMap.get('restaurantId'));
  if (Number.isNaN(restaurantId)) {
    router.navigate(['/']);
    return false;
  }

  if (auth.restaurantId === null || auth.restaurantId !== restaurantId) {
    router.navigate(['/']);
    return false;
  }
  return true;
};

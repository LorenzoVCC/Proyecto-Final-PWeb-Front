import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from '../services/auth-service';
import { fakeAsync } from '@angular/core/testing';

export const ownerGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const restaurantId = Number(route.paramMap.get('restaurantId'));

  if (!auth.isLogged) 
  {
    router.navigate(['/login']);
    return false;
  }

  if (auth.current?.id !== restaurantId) {
    router.navigate(['/']);  
    return false;
  }

  return true;
};

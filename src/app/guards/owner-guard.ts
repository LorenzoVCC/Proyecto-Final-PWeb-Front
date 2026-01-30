import { inject, Inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot } from '@angular/router';
import { Auth } from '../services/auth-service';
//import { fakeAsync } from '@angular/core/testing';

export const ownerGuard: CanActivateFn = (childroute, state) => {
  const auth = inject(Auth);
  const router = inject(Router);

  const restaurantId = Number(childroute.paramMap.get('restaurantId'));

  if (!auth.token) 
  {
    router.navigate(['/login']);
    return false;
  }

  const myId = auth.restaurantId;

  if (myId === null || myId !== auth.restaurantId) {
    router.navigate(['/']);
    return false;
  }
  return true;
};

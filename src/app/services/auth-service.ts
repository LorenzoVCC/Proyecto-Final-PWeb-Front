import { inject, Injectable, OnInit } from '@angular/core';
import { RestaurantLoginDTO } from '../interfaces/restaurant-interface';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})

export class Auth {
  restaurantId: number | null = this.readRestaurantId();

  private readRestaurantId(): number | null {
    const raw = localStorage.getItem('restaurantId');
    if (!raw) return null;  
    const n = Number(raw);
    return Number.isFinite(n) ? n : null;
  }

  get isLogged(): boolean {
    return this.restaurantId !== null;
  }

  setLogin(restaurantId: number) {
    this.restaurantId = restaurantId;
    localStorage.setItem('restaurantId', String(restaurantId));
  }

  logout() {
    this.restaurantId = null;
    localStorage.removeItem('restaurantId');
  }
}

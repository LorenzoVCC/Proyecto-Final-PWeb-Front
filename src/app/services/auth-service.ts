import { inject, Injectable, OnInit } from '@angular/core';
import { RestaurantLoginDTO } from '../interfaces/restaurant-interface';
import { Router } from '@angular/router';

export type CurrentRestaurant = {
  id: number;
  name: string;
  imageUrl?: string;
}

const lkey = 'currentRestaurant';

@Injectable({ providedIn: 'root' })

export class Auth {
  current: CurrentRestaurant | null = this.readCurrent();

  private readCurrent(): CurrentRestaurant | null {
    const lec = localStorage.getItem(lkey);
    if (!lec) return null;
    try {
      return JSON.parse(lec) as CurrentRestaurant; //lectura
    }
    catch {
      return null;
    }
  }

  get isLogged(): boolean {
    return this.current !== null;
  }

  get restaurantId(): number | null {
    return this.current?.id ?? null;
  }

  setLogin(restaurant: CurrentRestaurant) {
    this.current = restaurant;
    localStorage.setItem(lkey, JSON.stringify(restaurant));
  }

  logout() {
    this.current = null;

    localStorage.removeItem(lkey);
  }
}

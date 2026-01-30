import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { API_URL } from '../config/api';
import { RestaurantLoginDTO } from '../interfaces/restaurant-interface';

@Injectable({ providedIn: 'root' })

export class Auth {

  token: string | null = localStorage.getItem("token");
  revisionTokenInterval: number | undefined;
  router = inject(Router);

  get isLogged(): boolean {
    return this.token !== null;
  }

  async login(loginData: RestaurantLoginDTO) {

    const res = await fetch(`${API_URL}/api/authentication`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(loginData),
    });

    if (res.ok) {
      const token = await res.text();
      this.token = token;
      localStorage.setItem("token", token);
      this.revisionTokenInterval = this.revisionToken();
    }
    return res.ok;
  }

  logout() {
    localStorage.removeItem("token");
    this.token = null;
    this.router.navigate(["/login"]);

    if (this.revisionTokenInterval) clearInterval(this.revisionTokenInterval);
    this.revisionTokenInterval = undefined;
  }

  revisionToken() {
    return setInterval(() => {
      if (this.token) {
        const base64Url = this.token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));

        const claims: { exp: number } = JSON.parse(jsonPayload);
        if (new Date(claims.exp * 1000) < new Date()) {
          this.logout();
        }
      }
    }, 60_000);
  }

  get restaurantId(): number | null {
    if (!this.token) return null;
    
    try {
      const payload = JSON.parse(atob(this.token.split('.')[1]));
      const id = Number(payload.sub);
      return Number.isNaN(id) ? null : id;
    } catch {
      return null;
    }
  }
}

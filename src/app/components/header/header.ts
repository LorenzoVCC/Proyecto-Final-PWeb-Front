import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { Auth } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant-service';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})

export class Header {
  auth = inject(Auth);
  restaurantService = inject(RestaurantService);
  router = inject(Router);
  errorEnBack = false;

  menuOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  logout() { this.auth.logout(); this.menuOpen = false; }

  get isLogged(): boolean {
    return !!this.auth.token;
  }

  deleteMyRestaurant() {
    const id = this.auth.restaurantId;
    if (!id) return;

    const ok = this.restaurantService.deleteResto(id);
    if (!ok) { this.errorEnBack = true; return; }

    this.auth.logout();
    this.router.navigate(['/']);
  }

}

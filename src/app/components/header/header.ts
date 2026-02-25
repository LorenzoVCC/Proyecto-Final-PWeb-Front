import { Component, inject, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { Auth } from '../../services/auth-service';
import { CommonModule } from '@angular/common';
import { RestaurantService } from '../../services/restaurant-service';
import { ThemeService } from '../../services/theme-service';
import Swal from 'sweetalert2';
import { Toast } from '../../utils/modals';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})

export class Header {

  theme = inject(ThemeService);
  auth = inject(Auth);
  restaurantService = inject(RestaurantService);
  router = inject(Router);
  errorEnBack = false;

  menuOpen = false;

  toggleMenu() { this.menuOpen = !this.menuOpen; }

  logout() { this.auth.logout(); this.menuOpen = false; }

  async deleteMyRestaurant() {
    const id = this.auth.restaurantId;
    if (!id) return;

    const result = await Swal.fire({
      title: '¿Eliminar restaurante?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel',
      }
    });

    if (!result.isConfirmed) return;
    //// si (isConfirmed...)
    const ok = this.restaurantService.deleteResto(id);

    if (!ok) {
      this.errorEnBack = true;
      Toast.fire({
        icon: 'error',
        title: 'No se pudo eliminar el restaurante',
      });
      return;
    }

    Toast.fire({
      icon: 'success',
      title: 'Restaurante eliminado',
    });

    this.auth.logout();
    this.menuOpen = false;
    this.router.navigate(['/']);
  }

  async logoutConfirm() {
    const result = await Swal.fire({
      title: '¿Cerrar sesión?',
      text: 'Vas a salir de tu cuenta.',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, salir',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel',
      }
    });

    if (!result.isConfirmed) return;

    this.auth.logout();
    this.menuOpen = false;

    Toast.fire({ icon: 'success', title: 'Sesión cerrada' });
    this.router.navigate(['/']);
  }

  toggleTheme() {
    this.theme.toggle();
  }
}

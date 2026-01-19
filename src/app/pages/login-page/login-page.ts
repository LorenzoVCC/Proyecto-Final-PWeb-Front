import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { Auth } from '../../services/auth-service';
import { RestaurantService } from '../../services/restaurant-service';
import { RestaurantLoginDTO } from '../../interfaces/restaurant-interface';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})

export class LoginPage {
  router = inject(Router)
  restaurantService = inject(RestaurantService);
  auth = inject(Auth);

  solicitudABackEnCurso = false;
  errorlogin = false;

  async login(form:NgForm) {

    this.errorlogin = false;
    
    const email = form.value.email;
    const password = form.value.password;

    if (!email || !password)
    {
      this.errorlogin = true;
      return
    }

    const dto: RestaurantLoginDTO = { email, password } // ESTE DTO ESTOY USANDO: RESTAURANTLOGINDTO
    
    this.solicitudABackEnCurso = true;
    const restaurantId = this.restaurantService.authenticate(dto)
    this.solicitudABackEnCurso = false;
    
    if (!restaurantId) {
      this.errorlogin = true;
      return;
    }

    const restaurant = this.restaurantService.getById(restaurantId);

    if (!restaurant) {
      this.errorlogin = true;
      return;
    }

    this.auth.setLogin({
      id: restaurant.id,
      name: restaurant.name,
      imageUrl: restaurant.imageUrl
    });
    this.router.navigate(['/restaurant-page', restaurantId]);
  }
}
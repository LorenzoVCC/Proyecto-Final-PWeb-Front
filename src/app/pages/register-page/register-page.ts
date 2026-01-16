import { Component, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { RestaurantService } from '../../services/restaurant-service';
import { RestaurantForCreateDTO } from '../../interfaces/restaurant-interface';

type RestaurantRegisterForm = RestaurantForCreateDTO & { password2: string };

@Component({
  selector: 'register',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})


export class RegisterPage {
  isLoading = false;
  errorRegister = false;

  restaurantService = inject(RestaurantService);
  router = inject(Router);

  register(form: RestaurantRegisterForm) {
    this.errorRegister = false;

    if (
      !form.name ||
      !form.email ||
      !form.password ||
      !form.password2 ||
      !form.address ||
      !form.slug ||
      form.password !== form.password2) { this.errorRegister = true; return; }

    this.isLoading = true;

    const dto: RestaurantForCreateDTO = {
      name: form.name,
      email: form.email,
      password: form.password,
      description: form.description ?? '',
      imageUrl: form.imageUrl ?? '/restaurant-generic-img.jpg',
      bgImage: form.bgImage ?? '/comidas-fondo.jpg',
      address: form.address,
      slug: form.slug,
    };

    const created = this.restaurantService.register(dto);
    this.isLoading = false;

    this.router.navigate(['/restaurant-page', created.id]);
  }
}

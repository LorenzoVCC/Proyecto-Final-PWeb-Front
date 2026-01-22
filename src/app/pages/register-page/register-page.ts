import { Component, inject, viewChild, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink, Router } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
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


export class RegisterPage implements OnInit {

  router = inject(Router);
  route = inject(ActivatedRoute)
  restaurantService = inject(RestaurantService);
  
  isLoading = false;
  errorRegister = false;

  isEdit = false;
  restaurantId: number | null = null;

  name = '';
  email = '';
  password = '';
  password2 = '';
  description = '';
  imageUrl = '';
  bgImage = '';
  address = '';
  slug = '';

  ngOnInit(): void {
   const paramId = this.route.snapshot.paramMap.get('restaurantId'); 

   if (paramId) {
    this.isEdit = true;
    this.restaurantId = Number(paramId);

      const resto = this.restaurantService.getById(this.restaurantId);
//ultimo hecho
      if (resto) {
        // precarga del formulario
        this.name = resto.name;
        this.email = resto.email;
        this.description = resto.description ?? '';
        this.imageUrl = resto.imageUrl ?? '';
        this.bgImage = resto.bgImage ?? '';
        this.address = resto.address;
        this.slug = resto.slug;

        // en edit no se usan passwords
        this.password = '';
        this.password2 = '';
      }
    }
  }

//Hasta aca por hoy
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

    this.router.navigate(['login']);
  }
}

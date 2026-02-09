import { Component, inject, viewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { RestaurantService } from '../../services/restaurant-service';
import { RestaurantForCreateDTO, RestaurantForReadDTO, RestaurantForUpdateDTO } from '../../interfaces/restaurant-interface';
import { Auth } from '../../services/auth-service';

@Component({
  selector: 'register',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})

export class RegisterPage implements OnInit {

  restaurantService = inject(RestaurantService);
  router = inject(Router);
  auth = inject(Auth);

  errorEnBack = false;
  solicitudABackEnCurso = false;

  isEdit = false;
  restaurantBack: RestaurantForReadDTO | undefined = undefined;

  form = viewChild<NgForm>('registerForm');

  async ngOnInit() {
    const id = this.auth.restaurantId;
    if (!id) return;

    this.isEdit = true;

    const resto = await this.restaurantService.getById(id);
    if (!resto) return;

    this.restaurantBack = resto;

    setTimeout(() => {
      this.form()?.setValue({
        name: resto.name,
        email: '',
        password: '',
        password2: '',
        description: resto.description ?? '',
        imageUrl: resto.imageUrl ?? '',
        bgImage: resto.bgImage ?? '',
        address: resto.address,
        slug: resto.slug,
      });
    }, 0);
  }
  ////////////////////////////

  async handleFormSubmission(form: NgForm) {
    this.errorEnBack = false;
    this.solicitudABackEnCurso = true;
  
    if (form.invalid) return;

    if (!this.isEdit) {
      const dto: RestaurantForCreateDTO = {
        name: form.value.name,
        email: form.value.email,
        password: form.value.password,
        description: form.value.description,
        imageUrl: form.value.imageUrl,
        bgImage: form.value.bgImage,
        address: form.value.address,
        slug: form.value.slug,
      };

      if (
        !dto.name ||
        !dto.email ||
        !dto.password ||
        dto.password !== form.value.password2 ||
        !dto.address ||
        !dto.slug
      ) {
        this.solicitudABackEnCurso = false;
        this.errorEnBack = true;
        return;
      }

      const ok = await this.restaurantService.register(dto);
      this.solicitudABackEnCurso = false;

      if (!ok) {
        this.errorEnBack = true;
        return;
      }
      this.router.navigate(['/login']);
      return;
    }
    // //////////////////
    const id = this.auth.restaurantId;
    if (!id) {
      this.solicitudABackEnCurso = false;
      this.errorEnBack = true;
      return;
    }

    const updateResto: RestaurantForUpdateDTO = {
      name: form.value.name,
      description: form.value.description,
      imageUrl: form.value.imageUrl,
      bgImage: form.value.bgImage,
      address: form.value.address,
      slug: form.value.slug,
    };

    const ok = await this.restaurantService.updateResto(id, updateResto);
    this.solicitudABackEnCurso = false;

    if (!ok) {
      this.errorEnBack = true;
      return;
    }

    this.router.navigate(['/restaurant-page', id]);
  }
}

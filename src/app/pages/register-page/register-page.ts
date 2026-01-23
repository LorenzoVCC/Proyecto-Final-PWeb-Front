import { Component, inject, input, viewChild, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { RestaurantService } from '../../services/restaurant-service';
import { RestaurantForCreateDTO, RestaurantForUpdateDTO, RestaurantOwnerDTO } from '../../interfaces/restaurant-interface';
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
  restaurantBack: RestaurantOwnerDTO | undefined = undefined;

  form = viewChild<NgForm>('registerForm');

  ngOnInit() {
    
    const id = this.auth.restaurantId;

    if (!id) return;

    this.isEdit = true;

    const resto = this.restaurantService.getOwnerById(id);
    if (!resto) return;

    this.restaurantBack = resto;

    setTimeout(() => {
      this.form()?.setValue({
        name: resto.name,
        email: resto.email,
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

  handleFormSubmission(form: NgForm) {
    this.errorEnBack = false;
    this.solicitudABackEnCurso = true;
    let res;

    if (this.isEdit) {
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
      const updated = this.restaurantService.updateResto(id, updateResto);
      if (updated) {
        this.auth.setLogin({
          id: updated.id,
          name: updated.name,
          imageUrl: updated.imageUrl
        })
      }

      res = updated ? { id: updated.id } : null;
      
      this.solicitudABackEnCurso = false;
      if (!res) {
        this.errorEnBack = true;
        return;
      }
      
      this.router.navigate(['/restaurant-page', res.id]);
      return;
    }
    const newResto: RestaurantForCreateDTO = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
      description: form.value.description,
      imageUrl: form.value.imageUrl,
      bgImage: form.value.bgImage,
      address: form.value.address,
      slug: form.value.slug,
    }
    if (
      !newResto.name ||
      !newResto.email ||
      !newResto.password ||
      newResto.password !== form.value.password2 ||
      !newResto.address ||
      !newResto.slug)
      {
        this.solicitudABackEnCurso = false;
        this.errorEnBack = true;
        return;
      }

      const created = this.restaurantService.register(newResto);
      res = created ? { id: created.id } : null;

      this.solicitudABackEnCurso = false;

      if (!res) {
        this.errorEnBack = true;
        return;
      }

      this.router.navigate(['/restaurant-page', res.id])
  }
}

import { Component, inject, input, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { CategoryService } from '../../services/category-service';
import { CategoryCreateUpdateDTO, CategoryForReadDTO } from '../../interfaces/category-interface';
import { Auth } from '../../services/auth-service';

@Component({
  selector: 'new-category-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-category-page.html',
  styleUrl: './new-category-page.scss',
})

export class NewCategoryPage implements OnInit {

  categoryService = inject(CategoryService);
  router = inject(Router);
  auth = inject(Auth);

  errorEnBack = false;
  solicitudABackEnCurso = false;

  restaurantId = input.required<string>();
  categoryId = input<string | null>(null);

  isEdit = false;
  categoryBack: CategoryForReadDTO | undefined = undefined;

  form = viewChild<NgForm>('newCategoryForm');

  async ngOnInit() {

    const loggedRestaurantId = this.auth.restaurantId;
    if (!loggedRestaurantId) return;

    const catIdEdit = this.categoryId();
    if (!catIdEdit) return;

    const catId = Number(catIdEdit);
    if (Number.isNaN(catId)) return;

    const urlRestoId = Number(this.restaurantId());
    if (Number.isNaN(urlRestoId)) return;

    if (loggedRestaurantId !== urlRestoId) return;
    this.isEdit = true;

    const cat = await this.categoryService.getById(catId);
    if (!cat) return;

    if (cat.Id_Restaurant !== loggedRestaurantId) return;
    if (cat.Id_Restaurant !== urlRestoId) return;

    this.categoryBack = cat;

    setTimeout(() => {
      this.form()?.setValue({ name: cat.Name });
    }, 0);
  }

  async handleFormSubmission(form: NgForm) {
    this.errorEnBack = false;
    if (form.invalid) return;

    this.solicitudABackEnCurso = true;

    const loggedRestaurantId = this.auth.restaurantId;
    if (!loggedRestaurantId) {
      this.solicitudABackEnCurso = false;
      this.router.navigate(['/login']);
      return;
    }

    const urlRestaurantId = Number(this.restaurantId());
    if (Number.isNaN(urlRestaurantId) || loggedRestaurantId !== urlRestaurantId) {
      this.solicitudABackEnCurso = false;
      this.errorEnBack = true;
      return;
    }

    const dto: CategoryCreateUpdateDTO = { Name: (form.value.name ?? '').trim() };
    if (!dto.Name) {
      this.solicitudABackEnCurso = false;
      this.errorEnBack = true;
      return;
    }

    if (this.isEdit) {
      const catIdIni = this.categoryId();
      const catId = catIdIni ? Number(catIdIni) : NaN;
      if (Number.isNaN(catId)) {
        this.solicitudABackEnCurso = false;
        this.errorEnBack = true;
        return;
      }

      const updated = await this.categoryService.updateCategory(catId, dto);
      this.solicitudABackEnCurso = false;

      if (!updated) {
        this.errorEnBack = true;
        return;
      }

      this.router.navigate(['/restaurant-page', urlRestaurantId]);
      return;
    }
    const created = this.categoryService.createCategory(dto, loggedRestaurantId);
    this.solicitudABackEnCurso = false;

    if (!created) {
      this.errorEnBack = true;
      return;
    }

    form.resetForm();
    this.router.navigate(['/restaurant-page', urlRestaurantId]);
  }

}

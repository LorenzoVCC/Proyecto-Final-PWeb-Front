import { Component,inject, input, OnInit, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { NewProductPage } from '../new-product-page/new-product-page';

import { CategoryService } from '../../services/category-service';
import { CategoryCreateUpdateDTO } from '../../interfaces/category-interface';

@Component({
  selector: 'new-category-page',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './new-category-page.html',
  styleUrl: './new-category-page.scss',
})

export class NewCategoryPage {
  categoryService = inject(CategoryService)
  router = inject(Router);

  restaurantId = input.required<string>();

  handleFormSubmission(form: { name: string }) {
    if (!form.name) return;

    const dto: CategoryCreateUpdateDTO = {
      Name: form.name,
    }

    const created = this.categoryService.createCategory(dto, Number(this.restaurantId()));

    if (!created) return;

    this.router.navigate(['/restaurant-page', this.restaurantId()]);

  }
}

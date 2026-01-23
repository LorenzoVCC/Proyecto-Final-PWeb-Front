import { inject, Injectable } from '@angular/core';
import { CategoryCreateUpdateDTO, CategoryForReadDTO } from '../interfaces/category-interface';
import { ProductService } from './product.service';

@Injectable({ providedIn: 'root', })

export class CategoryService {

  private products = inject(ProductService);
  private categories: CategoryForReadDTO[] = [];

  getByRestaurantId(restaurantId: number): CategoryForReadDTO[] {
    return this.categories.filter(c => c.Id_Restaurant === restaurantId);
  }

  getById(id: number): CategoryForReadDTO | null {
    return this.categories.find(c => c.Id_Category === id) ?? null;
  }

  createCategory(dtodata: CategoryCreateUpdateDTO, restaurantId: number) {

    const newId = Math.max(...this.categories.map(c => c.Id_Category), 0) + 1;

    const created: CategoryForReadDTO = {
      Id_Category: newId,
      Name: dtodata.Name,
      Id_Restaurant: restaurantId,
    };
    this.categories.push(created);
    return created;
  }

  deleteCategory(categoryId: number): boolean {

    this.products.deleteByCategoryId(categoryId);
  
    const prev = this.categories.length;
    this.categories = this.categories.filter(c => c.Id_Category !== categoryId);
    return this.categories.length !== prev;

  }

  deleteByRestaurantId(restaurantId: number): void {
    const categoriesDelete = this.categories.filter(c => c.Id_Restaurant === restaurantId);

    for (const c of categoriesDelete) {
      this.products.deleteByCategoryId(c.Id_Category);
    }

    this.categories = this.categories.filter(c => c.Id_Restaurant !== restaurantId);
  }
}


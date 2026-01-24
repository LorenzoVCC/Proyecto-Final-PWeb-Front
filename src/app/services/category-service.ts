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

  createCategory(dtodata: CategoryCreateUpdateDTO, restaurantId: number): CategoryForReadDTO {

    const newId = Math.max(...this.categories.map(c => c.Id_Category), 0) + 1;

    const created: CategoryForReadDTO = {
      Id_Category: newId,
      Name: dtodata.Name,
      Id_Restaurant: restaurantId,
    };
    this.categories.push(created);
    return created;
  }

  updateCategory(categoryId: number, dto: CategoryCreateUpdateDTO): CategoryForReadDTO | null {
    const foundId = this.categories.findIndex(c => c.Id_Category === categoryId);
    if (foundId === -1) return null;

    const updated: CategoryForReadDTO = {
      ...this.categories[foundId],
      Name: dto.Name
    };

    this.categories[foundId] = updated;
    return updated;
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


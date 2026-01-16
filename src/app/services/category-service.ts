import { Injectable } from '@angular/core';
import { CategoryCreateUpdateDTO, CategoryForReadDTO } from '../interfaces/category-interface';

@Injectable({
  providedIn: 'root',
})

export class CategoryService {

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
}


import { Injectable } from '@angular/core';
import { CategoryCreateUpdateDTO, CategoryForReadDTO } from '../interfaces/category-interface';

@Injectable({
  providedIn: 'root',
})

export class CategoryService {
  private readonly LOGGED_RESTAURANT_ID = 1;

  private categories: CategoryForReadDTO[] = [
    { Id_Category: 1, Name: 'Appetizers', Id_Restaurant: 1 },
    { Id_Category: 2, Name: 'Main Courses', Id_Restaurant: 1 },
    { Id_Category: 3, Name: 'Desserts', Id_Restaurant: 2 },
  ];

  getByRestaurantId(restaurantId: number): CategoryForReadDTO[] {
    return this.categories.filter(c => c.Id_Restaurant === restaurantId);
  }

  getById(id: number): CategoryForReadDTO | null {
  return this.categories.find(c => c.Id_Category === id) ?? null;
  }
}

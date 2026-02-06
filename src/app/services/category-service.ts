import { inject, Injectable } from '@angular/core';
import { CategoryCreateUpdateDTO, CategoryForReadDTO } from '../interfaces/category-interface';
import { ProductService } from './product-service';
import { Auth } from './auth-service';
import { API_URL } from '../config/api';

@Injectable({ providedIn: 'root', })

export class CategoryService {

  private products = inject(ProductService);
  private auth = inject(Auth);
  readonly URL_BASE = `${API_URL}/api/Category`;

  categories: CategoryForReadDTO[] = [];

  private mapCategory(c: any): CategoryForReadDTO {
    return {
      Id_Category: c.id_Category ?? c.Id_Category ?? c.idCategory ?? c.id,
      Name: c.name ?? c.Name ?? '',
      Id_Restaurant: c.id_Restaurant ?? c.Id_Restaurant ?? c.idRestaurant ?? 0,
    };
  }

  async getByRestaurantId(restaurantId: number) {
    const res = await fetch(`${this.URL_BASE}/by-restaurant/${restaurantId}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.auth.token,
      },
    });

    if (res.status === 401) {
      this.auth.logout();
      this.categories = [];
      return [];
    }
    if (!res.ok) {
      this.categories = [];
      return [];
    }
    const data = await res.json();
    const list = data.map((c: any) => this.mapCategory(c));
    this.categories = list;
    return list;

  }

  async getById(id: number) {
    const res = await fetch(`${this.URL_BASE}/${id}`, {
      method: 'GET',
      headers: { Authorization: 'Bearer ' + this.auth.token },
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return null;
    const data = await res.json();
    return this.mapCategory(data);
  }

  async createCategory(dto: CategoryCreateUpdateDTO, restaurantId: number) {
    //Por no aprender a nombrar
    const payload: any = {
      name: dto.Name,
      id_Restaurant: restaurantId,
    };

    const res = await fetch(this.URL_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return null;

    const rescreated = await res.json();
    const created = this.mapCategory(rescreated);

    this.categories.push(created);
    return created;
  }

  async updateCategory(categoryId: number, dto: CategoryCreateUpdateDTO) {
    const payload: any = { name: dto.Name };

    const res = await fetch(`${this.URL_BASE}/${categoryId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token,
      },
      body: JSON.stringify(payload),
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return null;

    this.categories = this.categories.map(oldCategory => {
      if (oldCategory.Id_Category === categoryId) {
        return { ...oldCategory, Name: dto.Name };
      }
      return oldCategory
    });

    return this.getById(categoryId);
  }

  async deleteCategory(categoryId: number) {
    const res = await fetch(`${this.URL_BASE}/${categoryId}`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + this.auth.token },
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return false;

    this.products.deleteByCategoryId(categoryId);
    this.categories = this.categories.filter(c => c.Id_Category !==categoryId);
    return true;
  }
}


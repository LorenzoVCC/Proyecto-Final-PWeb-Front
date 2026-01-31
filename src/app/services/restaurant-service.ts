import { inject, Injectable } from '@angular/core';
import { RestaurantForCreateDTO, RestaurantForReadDTO, RestaurantForUpdateDTO, RestaurantOwnerDTO } from '../interfaces/restaurant-interface';
import { CategoryService } from './category-service';
import { Auth } from './auth-service';
import { API_URL } from '../config/api';

@Injectable({ providedIn: 'root' })

export class RestaurantService {

  private categoryService = inject(CategoryService);
  private auth = inject(Auth);

  //La proxima normalizo los nombres. MAPEO POR DISTINTOS NOMBRES.
  private mapRestaurant(r: any): RestaurantForReadDTO {
    return {
      id: r.id ?? r.id_Restaurant ?? r.idRestaurant,
      name: r.name ?? r.Name,
      description: r.description ?? r.Description ?? '',
      imageUrl: r.imageUrl ?? r.imageURL ?? r.ImageURL ?? '/restaurant-generic-img.jpg',
      bgImage: r.bgImage ?? r.bGImage ?? r.BGImage ?? '/comidas-fondo.jpg',
      address: r.address ?? r.Address ?? '',
      slug: r.slug ?? r.Slug ?? '',
      isActive: r.isActive ?? r.IsActive ?? true,
    };
  }

  //Metodos GetBy
  async getAll() {
    const res = await fetch(`${API_URL}/api/Restaurant`);

    if (!res.ok) return [];
    const data = await res.json();
    return data.map((r: any) => this.mapRestaurant(r));
  }

  async getById(id: number) {
    const res = await fetch(`${API_URL}/api/Restaurant/${id}`, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + this.auth.token,
      }
    });

    if (res.status === 401) {
      this.auth.logout();
      return null;
    }

    if (!res.ok) return null;

    const data = await res.json();
    return this.mapRestaurant(data);
  }

  async register(dto: RestaurantForCreateDTO) {
    const res = await fetch(`${API_URL}/api/Restaurant`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token,
      },
      body: JSON.stringify(dto),
    });

    if (res.status === 401) this.auth.logout();
    return res.ok;
  }

  async updateResto(id: number, dto: RestaurantForUpdateDTO) {
    const res = await fetch(`${API_URL}/api/Restaurant/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + this.auth.token,
      },
      body: JSON.stringify(dto),
    });

    if (res.status === 401) this.auth.logout();
    return res.ok;
  }

  async deleteResto(id: number) {
    const res = await fetch(`${API_URL}/api/Restaurant/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: 'Bearer ' + this.auth.token,
      },
    });

    if (res.status === 401) this.auth.logout();
    return res.ok;
  }
}


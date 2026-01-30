import { inject, Injectable } from '@angular/core';
import { RestaurantForCreateDTO, RestaurantForReadDTO, RestaurantForUpdateDTO, RestaurantLoginDTO, RestaurantOwnerDTO } from '../interfaces/restaurant-interface';
import { CategoryService } from './category-service';

@Injectable({ providedIn: 'root' })

export class RestaurantService {
  private categoryService = inject(CategoryService);
  restaurants: RestaurantForReadDTO[] = [];

  // private credentials: { restaurantId: number; email: string; password: string }[] = [
  //   { restaurantId: 1, email: 'resto1@mail.com', password: '1234' },
  //   { restaurantId: 2, email: 'resto2@mail.com', password: '1234' },
  // ];

  //Metodos GetBy
  getAll(): RestaurantForReadDTO[] {
    return this.restaurants.filter(r => r.isActive);
  }

  getById(id: number): RestaurantForReadDTO | null {
    return this.restaurants.find(r => r.id === id && r.isActive) ?? null
  }

  getOwnerById(id: number): RestaurantOwnerDTO | null {
    const resto = this.getById(id);
    if (!resto) return null;

    return {
      id: resto.id,
      name: resto.name,
      email: '',
      description: resto.description,
      imageUrl: resto.imageUrl,
      bgImage: resto.bgImage,
      address: resto.address,
      slug: resto.slug,
      createdAt: new Date().toISOString(),
    }
  }

  //Fin Metodos GetBy

  register(dto: RestaurantForCreateDTO): RestaurantForReadDTO {
    const newId = Math.max(...this.restaurants.map(r => r.id), 0) + 1;

    const created: RestaurantForReadDTO = {
      id: newId,
      name: dto.name,
      description: dto.description ?? '',
      imageUrl: dto.imageUrl ?? '/restaurant-generic-img.jpg',
      bgImage: dto.bgImage ?? '/comidas-fondo.jpg',
      address: dto.address,
      slug: dto.slug,
      isActive: true
    };

    this.restaurants.push(created);
    // this.credentials.push({
    //   restaurantId: newId,
    //   email: dto.email,
    //   password: dto.password,
    // })
    return created;
  }

  updateResto(id: number, dto: RestaurantForUpdateDTO): RestaurantForReadDTO | null {
    const idResto = this.restaurants.findIndex(r => r.id === id);
    if (idResto === -1) return null;

    const updated: RestaurantForReadDTO = {
      ...this.restaurants[idResto],
      ...dto,                 
      id: this.restaurants[idResto].id
    };

    this.restaurants[idResto] = updated;
    return updated;
  }

  deleteResto(id: number): boolean {
    const resto = this.getById(id);
    if (!resto) return false;

    this.categoryService.deleteByRestaurantId(id);

    resto.isActive = false;

    return true;
  }
}


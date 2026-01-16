import { Injectable } from '@angular/core';
import { RestaurantForCreateDTO, RestaurantForReadDTO } from '../interfaces/restaurant-interface';

@Injectable({ providedIn: 'root' })

export class RestaurantService {

  restaurants: RestaurantForReadDTO[] = [
    
    {  
      id: 1,
      name: 'Restaurante 1',
      description: 'Descripción mock',
      imageUrl: '/maldonal.jpg',
      address: 'Moreno 37',
      slug: 'res1-moreno',
      bgImage: '/comidas-fondo.jpg'
    },
    {
      id: 2,
      name: 'Restaurante 2',
      description: 'Otro restaurante',
      address: 'Av Siempre Viva 742',
      imageUrl: '/restaurant-generic-img.jpg',
      slug: 'restaurante-2',
    },

  ];

  getAll(): RestaurantForReadDTO[] {
    return this.restaurants;
  }

  getById(id:number): RestaurantForReadDTO | null {
    return this.restaurants.find(r => r.id === id) ?? null
  }

  register(dto:RestaurantForCreateDTO): RestaurantForReadDTO {
    const newId = Math.max(...this.restaurants.map(r => r.id), 0) + 1;

    const created: RestaurantForReadDTO = {
      id: newId,
      name: dto.name,
      description: dto.description ?? '',
      imageUrl: dto.imageUrl ?? '/restaurant-generic-img.jpg',
      bgImage: dto.bgImage ?? '/comidas-fondo',
      address: dto.address,
      slug: dto.slug,
    };

    this.restaurants.push(created);
    return created;
  }
}


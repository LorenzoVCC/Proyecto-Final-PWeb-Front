import { Injectable } from '@angular/core';
import { RestaurantForCreateDTO, RestaurantForReadDTO, RestaurantLoginDTO } from '../interfaces/restaurant-interface';

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

    private credentials: { restaurantId: number; email: string; password: string }[] = [
    { restaurantId: 1, email: 'resto1@mail.com', password: '1234' },
    { restaurantId: 2, email: 'resto2@mail.com', password: '1234' },
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
    this.credentials.push({
      restaurantId: newId,
      email: dto.email,
      password: dto.password,
    }) 
    return created;
  }

  authenticate(login: RestaurantLoginDTO): number | null {
    const resfound = this.credentials.find(c => c.email === login.email && c.password === login.password);
    return resfound ? resfound.restaurantId: null;
  }

}


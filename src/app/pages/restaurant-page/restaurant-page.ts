import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink } from "@angular/router";

import { RestaurantService } from '../../services/restaurant-service';
import { RestaurantForReadDTO } from '../../interfaces/restaurant-interface';

import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product.service';

import { CategoryPill } from '../../components/category-pill/category-pill';
import { CategoryService } from '../../services/category-service';
import { CategoryForReadDTO } from '../../interfaces/category-interface';
import { Auth } from '../../services/auth-service';

////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'restaurant-page',
  standalone: true,
  imports: [CategoryPill, ProductCard, RouterLink],
  templateUrl: './restaurant-page.html',
  styleUrl: './restaurant-page.scss',
})

////////////////////////////////////////////////////////////////////////////////

export class RestaurantPage implements OnInit {

  auth = inject(Auth);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  categories: CategoryForReadDTO[] = [];

  id = input.required<string>();
  readonly restaurantService = inject(RestaurantService);

  restaurant: RestaurantForReadDTO | undefined;
  cargandoRestaurant = false;

  ///////////////
  async ngOnInit() {
    this.cargandoRestaurant = true;

    this.restaurant = this.restaurantService.restaurants.find(
      r => r.id.toString() === this.id()
    );

    if (this.restaurant) {
      this.categories = this.categoryService.getByRestaurantId(this.restaurant.id);
    } else {
      this.categories = [];
    }

    this.cargandoRestaurant = false;
  }
  ///////////////

  getProductsByCategoryId(categoryId: number) {
    return this.productService.getByCategoryId(categoryId);
  }
}

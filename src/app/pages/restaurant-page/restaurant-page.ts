import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";

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
  router = inject(Router);
  private categoryService = inject(CategoryService);
  private productService = inject(ProductService);

  id = input.required<string>();
  readonly restaurantService = inject(RestaurantService);

  restaurant: RestaurantForReadDTO | undefined;
  cargandoRestaurant = false;

  categories: CategoryForReadDTO[] = [];


  //Estado: Categoria Seleccionada
  selectedCategoryId: number | null = null;

  ///////////////
  async ngOnInit() {
    this.cargandoRestaurant = true;

    const idNum = Number(this.id());
    if (Number.isNaN(idNum)) {
      this.cargandoRestaurant = false;
      return;
    }

    this.restaurant = await this.restaurantService.getById(idNum) ?? undefined;

    if (this.restaurant) {
      this.categories = await this.categoryService.getByRestaurantId(this.restaurant.id);

    } else {
      this.categories = [];
    }

    this.selectedCategoryId = null;
    this.cargandoRestaurant = false;
  }


  /////////////// METODOS SELECT CATEGORY
  clearSelection() {
    this.selectedCategoryId = null;
  }

  selectCategory(categoryId: number) {  //clickeo la pill
    if (this.selectedCategoryId === categoryId) {
      this.selectedCategoryId = null; //asi le saco el select
    } else {
      this.selectedCategoryId = categoryId;
    }
  }

  //Borrado
  async deleteSelectedCategory() {
    if (!this.restaurant) return;
    if (this.selectedCategoryId === null) return;

    const cat = await this.categoryService.getById(this.selectedCategoryId);
    if (!cat) return;
    if (cat.Id_Restaurant !== this.restaurant.id) return;

    const deleted = await this.categoryService.deleteCategory(this.selectedCategoryId);
    if (!deleted) return;

    this.categories = await this.categoryService.getByRestaurantId(this.restaurant.id);
    this.selectedCategoryId = null;
  }

  updateSelectedCategory() {
    if (!this.restaurant) return;
    if (this.selectedCategoryId === null) return;
    this.router.navigate(['/edit-category', this.restaurant.id, this.selectedCategoryId]);
  }

  getProductsForCategory(categoryId: number) {  //Trae los productos de esa categoria
    return this.productService.getByCategoryId(categoryId);
  }

  getProductsForCategoryView(categoryId: number) {
    return this.productService.getCachedByCategoryId(categoryId);
  }

}

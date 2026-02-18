import { Component, inject, input, Input, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { FormsModule } from '@angular/forms';

import { RestaurantService } from '../../services/restaurant-service';
import { RestaurantForReadDTO } from '../../interfaces/restaurant-interface';

import { ProductCard } from '../../components/product-card/product-card';
import { ProductService } from '../../services/product-service';
import { ProductForReadDTO } from '../../interfaces/product-interface';

import { CategoryPill } from '../../components/category-pill/category-pill';
import { CategoryService } from '../../services/category-service';
import { CategoryForReadDTO } from '../../interfaces/category-interface';

import Swal from 'sweetalert2';
import { Toast } from '../../utils/modals.ts';

import { Auth } from '../../services/auth-service';

@Component({
  selector: 'restaurant-page',
  standalone: true,
  imports: [CategoryPill, ProductCard, RouterLink, FormsModule],
  templateUrl: './restaurant-page.html',
  styleUrl: './restaurant-page.scss',
})
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
  selectedCategoryId: number | null = null;

  searchText = '';
  searching = false;

  searchResults: ProductForReadDTO[] = [];

  featuredProducts: ProductForReadDTO[] = [];

  @Input() compact = false;

  private searchTimeout: any = null;
  private searchRequestId = 0;

  filtersOpen = false;

  minPrice: number | null = null;
  maxPrice: number | null = null;
  onlyFeatured = false;
  onlyHappyHour = false;

  toggleFilters() {
    this.filtersOpen = !this.filtersOpen;
  }

  clearFilters() {
    this.minPrice = null;
    this.maxPrice = null;
    this.onlyFeatured = false;
    this.onlyHappyHour = false;

    this.searching = false;
    this.searchResults = [];
    clearTimeout(this.searchTimeout);

    this.filtersOpen = false;
  }

  private hasAnyFilterApplied(): boolean {
    return !!this.searchText.trim()
      || this.minPrice !== null
      || this.maxPrice !== null
      || this.onlyFeatured
      || this.onlyHappyHour
      || this.selectedCategoryId !== null;
  }

  async applyFilters() {
    if (!this.restaurant) return;

    if (!this.hasAnyFilterApplied()) {
      this.searching = false;
      this.searchResults = [];
      this.filtersOpen = false;
      return;
    }

    const reqId = ++this.searchRequestId;

    const results = await this.productService.searchProducts({
      restaurantId: this.restaurant.id,
      q: this.searchText?.trim() || undefined,
      categoryId: this.selectedCategoryId ?? undefined,
      featured: this.onlyFeatured ? true : undefined,
      happyHour: this.onlyHappyHour ? true : undefined,
      minPrice: this.minPrice ?? undefined,
      maxPrice: this.maxPrice ?? undefined,
    });

    if (reqId !== this.searchRequestId) return;
    this.searchResults = results;

    this.searching = true;
    this.filtersOpen = false;
  }

  onSearchInput(ev: Event) {
    const value = (ev.target as HTMLInputElement | null)?.value ?? '';
    this.searchText = value;

    const noFilters =
      !this.searchText.trim()
      && this.minPrice === null
      && this.maxPrice === null
      && !this.onlyFeatured
      && !this.onlyHappyHour
      && this.selectedCategoryId === null;

    if (noFilters) {
      this.searching = false;
      this.searchResults = [];
      clearTimeout(this.searchTimeout);
      return;
    }

    clearTimeout(this.searchTimeout);
    this.searchTimeout = setTimeout(async () => {
      if (!this.restaurant) return;

      const reqId = ++this.searchRequestId;

      const results = await this.productService.searchProducts({
        restaurantId: this.restaurant.id,
        q: this.searchText?.trim() || undefined,
        categoryId: this.selectedCategoryId ?? undefined,
        featured: this.onlyFeatured ? true : undefined,
        happyHour: this.onlyHappyHour ? true : undefined,
        minPrice: this.minPrice ?? undefined,
        maxPrice: this.maxPrice ?? undefined,
      });

      if (reqId !== this.searchRequestId) return;

      this.searchResults = results;
      this.searching = true;
    }, 300);
  }

  async ngOnInit() {
    this.cargandoRestaurant = true;

    const idNum = Number(this.id());
    if (Number.isNaN(idNum)) {
      this.cargandoRestaurant = false;
      return;
    }

    this.productService.products = [];
    this.restaurant = await this.restaurantService.getById(idNum) ?? undefined;

    if (this.restaurant) {
      this.featuredProducts = await this.productService.getFeaturedByRestaurant(this.restaurant.id);

      this.categories = await this.categoryService.getByRestaurantId(this.restaurant.id);

      for (const c of this.categories) {
        await this.productService.getByCategoryId(c.Id_Category);
      }
    } else {
      this.categories = [];
      this.featuredProducts = [];
    }

    this.selectedCategoryId = null;

    this.searchText = '';
    this.searching = false;
    this.searchResults = [];
    clearTimeout(this.searchTimeout);

    this.filtersOpen = false;
    this.minPrice = null;
    this.maxPrice = null;
    this.onlyFeatured = false;
    this.onlyHappyHour = false;

    this.cargandoRestaurant = false;
  }

  clearSelection() {
    this.selectedCategoryId = null;

    if (!this.hasAnyFilterApplied()) {
      this.searching = false;
      this.searchResults = [];
      return;
    }

    this.applyFilters();
  }

  selectCategory(categoryId: number) {
    this.selectedCategoryId =
      this.selectedCategoryId === categoryId ? null : categoryId;

    if (!this.hasAnyFilterApplied()) {
      this.searching = false;
      this.searchResults = [];
      return;
    }

    this.applyFilters();
  }

  async deleteSelectedCategory() {
    if (!this.restaurant) return;
    if (this.selectedCategoryId === null) return;

    const cat = await this.categoryService.getById(this.selectedCategoryId);
    if (!cat) return;
    if (cat.Id_Restaurant !== this.restaurant.id) return;

    const result = await Swal.fire({
      title: '¿Eliminar categoría?',
      text: 'Esta acción no se puede deshacer.',
      icon: 'error',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar',
      customClass: {
        popup: 'swal-popup',
        title: 'swal-title',
        confirmButton: 'swal-confirm',
        cancelButton: 'swal-cancel',
      }
    });

    if (!result.isConfirmed) return;

    const deleted = await this.categoryService.deleteCategory(this.selectedCategoryId);

    if (!deleted) {
      Toast.fire({ icon: 'error', title: 'No se pudo eliminar la categoría' });
      return;
    }

    Toast.fire({ icon: 'success', title: 'Categoría eliminada' });

    this.categories = await this.categoryService.getByRestaurantId(this.restaurant.id);
    this.selectedCategoryId = null;

    if (this.searching) this.applyFilters();
  }

  updateSelectedCategory() {
    if (!this.restaurant) return;
    if (this.selectedCategoryId === null) return;
    this.router.navigate(['/edit-category', this.restaurant.id, this.selectedCategoryId]);
  }

  getProductsForCategory(categoryId: number) {
    return this.productService.getByCategoryId(categoryId);
  }

  getProductsForCategoryView(categoryId: number) {
    return this.productService.getCachedByCategoryId(categoryId);
  }
}

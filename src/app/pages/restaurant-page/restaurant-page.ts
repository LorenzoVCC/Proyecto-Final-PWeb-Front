import { Component } from '@angular/core';
import { CategoryPill } from '../../components/category-pill/category-pill';
import { ProductCard } from '../../components/product-card/product-card';
import { ProductPage } from '../product-page/product-page';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'restaurant-page',
  imports: [ProductPage, CategoryPill, ProductCard, RouterLink],
  templateUrl: './restaurant-page.html',
  styleUrl: './restaurant-page.scss',
})
export class RestaurantPage {

}

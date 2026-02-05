import { Component, inject, input, OnInit } from '@angular/core';
import { RouterLink, Router } from "@angular/router";
import { CommonModule } from '@angular/common';
import { Auth } from '../../services/auth-service';

import { CategoryService } from '../../services/category-service';

import { ProductService } from '../../services/product.service';
import { ProductForReadDTO } from '../../interfaces/product-interface';

@Component({
  selector: 'product-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})

export class ProductPage implements OnInit {

  private router = inject(Router);
  auth = inject(Auth);

  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);

  id = input.required<string>();

  product: ProductForReadDTO | null = null;
  restaurantBack: number | null = null;
  canEdit = false;
  errorEnBack = false;

  async ngOnInit() {
    const id = Number(this.id());
    if (Number.isNaN(id)) return;

    const prodId = await this.productService.getById(id);
    if (!prodId) return;

    this.product = prodId;

    const categ = await this.categoryService.getById(prodId.id_Category);
    this.restaurantBack = categ?.Id_Restaurant ?? null;

    this.canEdit =
      !!this.auth.token &&
      this.restaurantBack !== null &&
      this.auth.restaurantId === this.restaurantBack;
  }

  backMenu() {
    if (this.restaurantBack !== null) {
      this.router.navigate(['/restaurant-page', this.restaurantBack]);
    } else {
      this.router.navigate(['']);
    }
  }

  editProduct() {
    if (!this.canEdit || !this.product || this.restaurantBack === null) return;
    this.router.navigate(['/edit-product-page', this.restaurantBack, this.product.id_Category, this.product.id_Product]);
  }

  deleteProduct() {
    if (!this.canEdit || !this.product) return;

    const ok = this.productService.deleteProduct(this.product.id_Product);
    if (!ok) return;

    this.backMenu();
  }

  //Metodos fuera de CRUD
  
  async changeDiscount() {
    if (!this.canEdit || !this.product) return;

    const current = this.product.discount ?? 0;

    const value = prompt("Nuevo descuento (%)", String(current));
    if (value === null) return;

    const discount = Number(value);

    if (Number.isNaN(discount) || discount < 0 || discount > 90) {
      alert("Descuento inválido. Usá un número entre 0 y 90.");
      return;
    }

    const ok = await this.productService.updateDiscount(
      this.product.id_Product,
      discount
    );
    
    if (!ok) {
      this.errorEnBack = true;
      return;
    }
    
    // reflejo inmediato en UI
    this.product.discount = discount;
  }
  
  async toggleHappyHour() {
    if (!this.product) return;

    const ok = await this.productService.toggleHappyHour(
      this.product.id_Product
    );

    if (!ok) {
      this.errorEnBack = true;
      return;
    }
    this.product.happyHour = !this.product.happyHour;;
  }

  getDiscountPrice(): number {
    if (!this.product) return 0;
    const descuentoPorcentaje = this.product.discount ?? 0;
    return this.product.price - (this.product.price * descuentoPorcentaje / 100);
  }
  
}
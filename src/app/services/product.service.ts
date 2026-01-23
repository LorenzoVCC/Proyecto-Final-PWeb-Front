import { inject, Injectable } from '@angular/core';
import { ProductForCreateUpdateDTO, ProductForReadDTO } from '../interfaces/product-interface';

@Injectable({ providedIn: 'root' })

export class ProductService {
  products: ProductForReadDTO[] = [];

  getById(id: number) {
    return this.products.find(p => p.id_Product === id) ?? null;
  }

  getByCategoryId(categoryid: number) {
    return this.products.filter(p => p.id_Category ===  categoryid);
  }

  createProduct(dto: ProductForCreateUpdateDTO) {
    const newId = Math.max(...this.products.map(p => p.id_Product), 0) + 1;

    const created: ProductForReadDTO = { id_Product: newId, ...dto };

    this.products.push(created);
    return created;
  }

  deleteByCategoryId(categoryId: number): void {
    this.products = this.products.filter(p => p.id_Category !== categoryId);
  }
}

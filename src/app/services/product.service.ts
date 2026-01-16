import { Injectable } from '@angular/core';
import { ProductForCreateUpdateDTO, ProductForReadDTO } from '../interfaces/product-interface';

@Injectable({ providedIn: 'root' })

export class ProductService {

  products: ProductForReadDTO[] = [];

  getByCategoryId(getByCategoryId: number) {
    return this.products.filter(p => p.id_Category === getByCategoryId);
  }

  createProduct(dto: ProductForCreateUpdateDTO) {
    const newId = this.products.length + 1;
    const created: ProductForReadDTO = { id_Product: newId, ...dto 
    };

    this.products.push(created);
    return created;
  }
}

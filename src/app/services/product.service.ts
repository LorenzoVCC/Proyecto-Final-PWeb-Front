import { Injectable } from '@angular/core';
import { ProductForCreateUpdateDTO, ProductForReadDTO } from '../interfaces/product-interface';

@Injectable({ providedIn: 'root' })

export class ProductService {

  products: ProductForReadDTO[] = [
    { id_Product: 1, name: 'Papas', description: 'Con cheddar', price: 3500, discount: 0, urlImage: '', id_Category: 1 },
    { id_Product: 2, name: 'Hamburguesa', description: 'SimpleSimpleSimpleSiSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimpleSimplempleSimpleSimpleSimpleSimpleSimpleSimple', price: 5500, discount: 10, urlImage: '/Burger', id_Category: 2 },
    { id_Product: 3, name: 'Helado', description: 'Chocolate', price: 2500, discount: 0, urlImage: '', id_Category: 3 },
  ];

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

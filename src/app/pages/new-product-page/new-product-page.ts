import { Component, input, inject, viewChild } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';

import { ProductService } from '../../services/product.service';
import { ProductForCreateUpdateDTO } from '../../interfaces/product-interface';

////////////////////////////////////////////////////////////////////////////////

@Component({
  selector: 'new-product-page',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './new-product-page.html',
  styleUrl: './new-product-page.scss',
})

export class NewProductPage {
  productService = inject(ProductService);
  router = inject(Router);

  //Paso los parametros recibidos por la URL a las variables restaurantId y categoryId
  restaurantId = input<string>();
  categoryId = input<string>();
  
  errorEnBack = false;
  solicitudABackEnCurso = false;

  form = viewChild<NgForm>('newProductForm');

  handleFormSubmission(form: NgForm) {
    this.errorEnBack = false;

    const newProduct: ProductForCreateUpdateDTO = {
      name: form.value.name,
      description: form.value.description ?? '',
      price: Number(form.value.price),
      discount: Number(form.value.discount ?? 0),
      urlImage: form.value.urlImage ?? '',
      id_Category: Number(this.categoryId()),
    };

    this.solicitudABackEnCurso = true;
    const ans = this.productService.createProduct(newProduct);
    this.solicitudABackEnCurso = false;

    if (!ans) {
      this.errorEnBack = true;
      return;
    }

    //Volvemo pa' tra...
    this.router.navigate(['/restaurant-page', this.restaurantId()]);
  }
}
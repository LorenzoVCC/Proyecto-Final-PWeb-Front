import { RouterLink } from "@angular/router";
import { Component, input } from '@angular/core';
import { ProductForReadDTO } from "../../interfaces/product-interface";
import { ProductPage } from "../../pages/product-page/product-page";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'product-card',
  imports: [RouterLink, CommonModule],
  templateUrl: './product-card.html',
  styleUrl: './product-card.scss',
})
export class ProductCard {

  product = input.required<ProductForReadDTO>();

  //Metodo para calcular descuento
  getDiscountPrice() {
    const p = this.product();
    const descuentoPorcentaje = p.discount ?? 0;
    return p.price - (p.price * descuentoPorcentaje / 100);
  }

}

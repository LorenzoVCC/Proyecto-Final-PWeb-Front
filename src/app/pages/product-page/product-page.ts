import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { RouterLink } from "@angular/router";
import { ProductForReadDTO } from '../../interfaces/product-interface';

@Component({
  selector: 'product-page',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './product-page.html',
  styleUrl: './product-page.scss',
})

export class ProductPage implements OnInit {
  private route = inject(ActivatedRoute);
  private productService = inject(ProductService);

  product: ProductForReadDTO | null = null;

  ngOnInit() {

    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.productService.getById(id);
  }
}

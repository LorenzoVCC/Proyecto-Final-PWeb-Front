import { Component, Input } from '@angular/core';
import { CategoryForReadDTO } from '../../interfaces/category-interface';

@Component({
  selector: 'category-pill',
  imports: [],
  templateUrl: './category-pill.html',
  styleUrl: './category-pill.scss',
})
export class CategoryPill {
  @Input() category!: CategoryForReadDTO}

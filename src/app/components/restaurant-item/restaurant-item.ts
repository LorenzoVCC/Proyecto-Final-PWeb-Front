import { Component, Input } from '@angular/core';
import { RestaurantForReadDTO } from '../../interfaces/restaurant-interface';
import { RestaurantService } from '../../services/restaurant-service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-restaurant-item',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './restaurant-item.html',
  styleUrl: './restaurant-item.scss',
})

export class RestaurantItem {
  @Input() restaurant!: RestaurantForReadDTO;
}

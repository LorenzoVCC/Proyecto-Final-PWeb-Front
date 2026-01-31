import { Component, inject, OnInit } from '@angular/core';
import { RestaurantItem } from '../../components/restaurant-item/restaurant-item';
import { RouterLink } from '@angular/router';
import { RestaurantService } from '../../services/restaurant-service';
import { RestaurantForReadDTO } from '../../interfaces/restaurant-interface';

@Component({
  selector: 'app-restaurant-list-page',
  standalone: true,
  imports: [RestaurantItem, RouterLink],
  templateUrl: './restaurant-list-page.html',
  styleUrl: './restaurant-list-page.scss',
})
 
export class RestaurantListPage implements OnInit {

  private restaurantService = inject(RestaurantService);
  restaurants: RestaurantForReadDTO[] = []; //Lista contenedora de restaurants

  async ngOnInit() {
    this.restaurants = await this.restaurantService.getAll();
  }
}

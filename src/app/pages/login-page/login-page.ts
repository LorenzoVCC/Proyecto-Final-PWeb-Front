import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { FormsModule, NgForm } from '@angular/forms';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { Auth } from '../../services/auth-service';
import { RestaurantLoginDTO } from '../../interfaces/restaurant-interface';
import { Token } from '@angular/compiler';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss'
})

export class LoginPage {
  
  router = inject(Router)
  auth = inject(Auth);
  solicitudABackEnCurso = false;
  errorlogin = false;

  async login(form:NgForm) {
    this.errorlogin = false;
    
    if (form.invalid)
    {
      this.errorlogin = true;
      return
    }

    this.solicitudABackEnCurso = true;
    const loginResult = await this.auth.login(form.value);
    this.solicitudABackEnCurso = false;

    if (loginResult)
    {
      const id = this.auth.restaurantId;
      this.router.navigate(id ? ['/restaurant-page', id] : ['/']);
      return;
    } 
    
    this.errorlogin = true;
  }
}
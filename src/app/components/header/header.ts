import { Component, inject } from '@angular/core';
import { RouterLink } from "@angular/router";
import { Auth } from '../../services/auth-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})

export class Header {
  auth = inject(Auth);
  menuOpen = false;

  toogleMenu() { this.menuOpen = !this.menuOpen; }

  logout() { this.auth.logout(); this.menuOpen = false; }
}

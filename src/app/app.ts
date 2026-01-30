import { Component, signal, inject, OnInit} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Auth } from './services/auth-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  
  auth = inject(Auth);
  
  protected readonly title = signal('Proyecto-Final-PWeb');
    ngOnInit(): void {
    if (this.auth.token && !this.auth.revisionTokenInterval) {
      this.auth.revisionTokenInterval = this.auth.revisionToken();
    }
  }
}

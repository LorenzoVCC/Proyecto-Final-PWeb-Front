  import { Component, signal, inject, OnInit} from '@angular/core';
  import { RouterOutlet } from '@angular/router';
  import { Auth } from './services/auth-service';
  import { ThemeService } from './services/theme-service';

  @Component({
    selector: 'app-root',
    imports: [RouterOutlet],
    templateUrl: './app.html',
    styleUrl: './app.scss'
  })
  export class App implements OnInit {
    
    theme = inject(ThemeService); 
    auth = inject(Auth);
    
    protected readonly title = signal('Proyecto-Final-PWeb');

      ngOnInit(): void {
      if (this.auth.token && !this.auth.revisionTokenInterval) {
        this.auth.revisionTokenInterval = this.auth.revisionToken();
      }
      
      this.theme.init();
    }
  }

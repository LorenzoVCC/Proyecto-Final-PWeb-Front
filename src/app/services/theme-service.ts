import { Injectable } from '@angular/core';

type Theme = 'light' | 'dark';

@Injectable({ providedIn: 'root' })
export class ThemeService {

  private readonly themeMode = 'theme';

  init() {
    const saved = (localStorage.getItem(this.themeMode) as Theme) || 'light';
    this.apply(saved);
  }

  toggle() {
    const themeMode = (localStorage.getItem(this.themeMode) as Theme) || 'light';
    const next: Theme = themeMode === 'light' ? 'dark' : 'light';
    this.apply(next);
  }

  private apply(theme: Theme) {
    localStorage.setItem(this.themeMode, theme);

    document.body.classList.remove('theme-light', 'theme-dark');
    document.body.classList.add(theme === 'dark' ? 'theme-dark' : 'theme-light');
  }

  isDark(): boolean {
    const current = (localStorage.getItem(this.themeMode) as Theme) || 'light';
    return current === 'dark';
  }

}

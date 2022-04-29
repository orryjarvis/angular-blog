import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  enableDarkMode(): void {
    document.body.classList.remove('light-theme');
  }

  enableLightMode(): void {
    document.body.classList.add('light-theme');
  }

  isDarkMode(): boolean {
    return !document.body.classList.contains('light-theme');
  }
}

import { DOCUMENT, } from '@angular/common';
import { Injectable, Inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  constructor(@Inject(DOCUMENT) private document: Document) {
  }

  enableDarkMode(): void {
    this.document.body.classList.remove('light-theme');
  }

  enableLightMode(): void {
    this.document.body.classList.add('light-theme');
  }

  isDarkMode(): boolean {
    return !this.document.body.classList.contains('light-theme');
  }
}

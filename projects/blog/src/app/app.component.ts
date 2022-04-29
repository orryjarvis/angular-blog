import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { environment } from '../environments/environment';
import { ThemeService } from './theme/theme.service';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = environment.application;

  isDarkMode = true;
  slideToggleLabel = "🌙";

  constructor(private themeService: ThemeService) { }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.slideToggleLabel = this.isDarkMode ? "🌙" : "🔆";
  }

  onThemeChange($event: MatSlideToggleChange): void {
    if ($event.checked) {
      this.themeService.enableDarkMode();
      this.slideToggleLabel = "🌙";
    } else {
      this.themeService.enableLightMode();
      this.slideToggleLabel = "🔆";
    }
  }
}

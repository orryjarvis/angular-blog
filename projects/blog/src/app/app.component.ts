import { Component, OnInit } from '@angular/core';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { environment } from '../environments/environment';
import { ThemeService } from './theme/theme.service';
import { StatusService } from './status/status.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public scrollProgress$: Observable<number>;
  title = environment.application;

  isDarkMode = true;
  slideToggleLabel = "🌙";

  constructor(private themeService: ThemeService, private statusService: StatusService) {
    this.scrollProgress$ = new Observable<number>();
  }

  ngOnInit(): void {
    this.isDarkMode = this.themeService.isDarkMode();
    this.slideToggleLabel = this.isDarkMode ? "🌙" : "🔆";
    this.scrollProgress$ = this.statusService.observeScrollProgress();
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

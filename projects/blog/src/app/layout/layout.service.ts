import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { LoggingService } from '../logging/logging.service';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {

  displayNameMap = new Map([
    [Breakpoints.HandsetLandscape, 'Handset landscape'],
    [Breakpoints.HandsetPortrait, 'Handset portrait'],
    [Breakpoints.TabletLandscape, 'Tablet landscape'],
    [Breakpoints.TabletPortrait, 'Tablet portrait'],
    [Breakpoints.WebLandscape, 'Web landscape'],
    [Breakpoints.WebPortrait, 'Web portrait'],
  ]);

  constructor(private loggingService: LoggingService, private breakpointObserver: BreakpointObserver) {
    this.breakpointObserver
      .observe([
        Breakpoints.Handset,
        Breakpoints.Tablet,
        Breakpoints.Web,
      ])
      .subscribe(result => {
        for (const query of Object.keys(result.breakpoints)) {
          if (result.breakpoints[query]) {
            const displayName = this.displayNameMap.get(query) ?? 'Unknown';
            this.loggingService.logDiagnostic(`${displayName} layout active`);
          }
        }
      });
  }

}

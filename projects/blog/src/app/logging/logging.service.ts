import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LoggingService {

  constructor() { }

  logDiagnostic(message: string) {
    if (!environment.production) {
      console.info(message);
    }
  }

  logError(message: string, stackTrace: string) {
    // TODO: External logging
  }
}

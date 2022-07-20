import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private snackBar: MatSnackBar) { }

  showSuccess(message: string): void {
    this.snackBar.open(message, 'X');
  }

  showDiagnostic(message: string): void {
    if (!environment.production) {
      this.snackBar.open(message, 'X');
    }
  }

  showError(message: string, stackTrace: string): void {
    this.snackBar.open(message, 'X');
  }
}

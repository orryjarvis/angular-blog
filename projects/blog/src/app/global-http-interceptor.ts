import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { StatusService } from './status/status.service';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(private statusService: StatusService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.statusService.incrementQueryCount();
    const response = next.handle(request);
    this.statusService.decrementQueryCount();
    return response;
  }
}

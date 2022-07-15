import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable, share, finalize } from 'rxjs';
import { StatusService } from './status/status.service';
import { HttpCacheService } from './http-cache-service';

@Injectable()
export class GlobalHttpInterceptor implements HttpInterceptor {

  constructor(private statusService: StatusService, private httpCacheService: HttpCacheService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.statusService.incrementQueryCount();
    const response = this.httpCacheService.handle(request, next).pipe(
      finalize(() => this.statusService.decrementQueryCount()),
      share()
    );
    return response;
  }
}

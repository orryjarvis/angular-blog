import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpRequest, HttpHandler,
  HttpInterceptor
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GlobalHttpInterceptor implements HttpInterceptor {
  private queriesInProgress$: BehaviorSubject<number>;

  constructor() {
    this.queriesInProgress$ = new BehaviorSubject<number>(0);
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.queriesInProgress$.next(this.queriesInProgress$.value + 1);
    const response = next.handle(request);
    this.queriesInProgress$.next(this.queriesInProgress$.value - 1);
    return response;
  }

  observeQueriesInProgress(): Observable<number> {
    return this.queriesInProgress$;
  }
}

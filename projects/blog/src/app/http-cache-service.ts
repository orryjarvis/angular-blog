import { HttpEvent, HttpHandler, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, of, tap, share } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class HttpCacheService {
  private cache: Map<string, HttpResponse<any>> = new Map()

  handle(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.method !== "GET") {
      return next.handle(request);
    }
    const cachedResponse = this.cache.get(request.urlWithParams);
    if (cachedResponse) {
      return of(cachedResponse.clone());
    }
    return next.handle(request).pipe(
      tap(stateEvent => {
        if (stateEvent instanceof HttpResponse) {
          this.cache.set(request.urlWithParams, stateEvent);
        }
      }),
      share()
    );
  }
}

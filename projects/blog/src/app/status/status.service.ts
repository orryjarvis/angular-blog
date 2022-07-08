import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, fromEvent, map, Observable, Subscription } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StatusService implements OnDestroy {
  private scrollProgress$: BehaviorSubject<number>;
  private scrollProgressSubscription: Subscription;

  constructor() {
    this.scrollProgress$ = new BehaviorSubject<number>(0);

    this.scrollProgressSubscription = fromEvent(window, "scroll").pipe(
      map(() => {
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        return Math.round((winScroll / height) * 100);
      })).subscribe(this.scrollProgress$);
  }

  ngOnDestroy(): void {
    this.scrollProgressSubscription.unsubscribe();
  }

  observeScrollProgress(): Observable<number> {
    return this.scrollProgress$;
  }

  getScrollProgress(): number {
    return this.scrollProgress$.value;
  }
}

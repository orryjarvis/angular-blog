import { ScrollDispatcher } from '@angular/cdk/scrolling';
import { Injectable, NgZone, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, map, Observable, Subscription } from 'rxjs';

export type Status = Progress | Query | Idle;

export interface Progress {
  type: 'progress';
  value: number;
}

export interface Query {
  type: 'query'
}

export interface Idle {
  type: 'idle'
}

@Injectable({
  providedIn: 'root'
})
export class StatusService implements OnDestroy {
  private scrollProgress$ = new BehaviorSubject<number>(0);
  private scrollProgressSubscription?: Subscription;

  private status$ = new BehaviorSubject<Status>({ type: 'idle' });
  private statusSubscription?: Subscription;

  private queryCount$ = new BehaviorSubject<number>(0);

  constructor(private scrollDispatcher: ScrollDispatcher, private zone: NgZone) {

    this.scrollProgressSubscription = this.scrollDispatcher.scrolled(25).pipe(
      map(() => {
        const winScroll =
          document.body.scrollTop || document.documentElement.scrollTop;
        const height =
          document.documentElement.scrollHeight -
          document.documentElement.clientHeight;
        const percent = Math.round((winScroll / height) * 100);
        return isNaN(percent) ? 0 : percent;
      })).subscribe(p => this.zone.run(() => this.scrollProgress$.next(p)));

    this.statusSubscription = combineLatest([
      this.scrollProgress$,
      this.queryCount$.asObservable()
    ], (scrollProgress, queriesInProgress) => {
      if (queriesInProgress > 0) {
        return { type: 'query' } as Status;
      }
      else if (scrollProgress > 0) {
        return { type: 'progress', value: scrollProgress } as Status;
      }
      return { type: 'idle' } as Status;
    }).subscribe(s => this.zone.run(() => this.status$.next(s)));
  }

  ngOnDestroy(): void {
    this.scrollProgressSubscription?.unsubscribe();
    this.statusSubscription?.unsubscribe();
  }

  incrementQueryCount(): void {
    this.queryCount$.next(this.queryCount$.value + 1);
  }

  decrementQueryCount(): void {
    this.queryCount$.next(this.queryCount$.value - 1);
  }

  observeStatus(): Observable<Status> {
    return this.status$.asObservable();
  }
}

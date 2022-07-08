import { Injectable, OnDestroy } from '@angular/core';
import { BehaviorSubject, combineLatest, fromEvent, map, Observable, Subscription, tap } from 'rxjs';
import { GlobalHttpInterceptor } from '../global-http-interceptor';

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
  private scrollProgress$: BehaviorSubject<number>;
  private scrollProgressSubscription: Subscription;

  private status$: BehaviorSubject<Status>;
  private statusSubscription: Subscription;

  constructor(private httpInterceptor: GlobalHttpInterceptor) {
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

    this.status$ = new BehaviorSubject<Status>({ type: 'idle' });

    this.statusSubscription = combineLatest([this.scrollProgress$, this.httpInterceptor.observeQueriesInProgress()], (scrollProgress, queriesInProgress) => {
      if (queriesInProgress > 0) {
        return { type: 'query' } as Status;
      }
      return { type: 'progress', value: scrollProgress } as Status;
    }).subscribe(this.status$);
  }

  ngOnDestroy(): void {
    this.scrollProgressSubscription.unsubscribe();
    this.statusSubscription.unsubscribe();
  }

  observeStatus(): Observable<Status> {
    return this.status$.pipe(tap(status => {
      console.log(status);
    }));
  }
}

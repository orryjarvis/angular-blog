import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { BehaviorSubject, combineLatest, debounce, filter, first, interval, mergeMap, Observable, scan, Subscription } from 'rxjs';
import { Blog, BlogManifest, BlogService } from './blog.service';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  blogs$: Observable<Blog[]>;
  blogManifest$: BehaviorSubject<BlogManifest | null>;
  scrollSubscription: Subscription | null;

  constructor(private blogService: BlogService) {
    this.blogs$ = new Observable<Blog[]>();
    this.blogManifest$ = new BehaviorSubject<BlogManifest | null>(null);
    this.scrollSubscription = null;
  }
  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.scrollSubscription = this.viewport.scrolledIndexChange.pipe(debounce(i => interval(25))).subscribe({
      next: (i) => {
        const end = this.viewport.getRenderedRange().end;
        const total = this.viewport.getDataLength();
        if (end === total) {
          this.nextManifest();
        }
      }
    });
  }

  ngOnInit(): void {
    // TODO: extract somewhere general
    function isNonNull<T>(value: T): value is NonNullable<T> {
      return value != null;
    }

    this.blogs$ = this.blogManifest$
      .pipe(
        filter(isNonNull),
        mergeMap(manifest => combineLatest(manifest.posts.map(post => this.blogService.fetch(post.file)))),
        scan((acc, value) => [...acc, ...value])
      );
  }

  nextManifest(): void {
    const prev = this.blogManifest$.value;
    if (!prev) {
      this.blogService.fetchManifest().pipe(first()).subscribe({
        next: manifest => this.blogManifest$.next(manifest)
      });
    } else if (!prev.continuation) {
      this.blogManifest$.complete();
    }
    else {
      this.blogService.fetchManifest(prev).pipe(first()).subscribe({
        next: manifest => this.blogManifest$.next(manifest)
      });
    }
  }
}

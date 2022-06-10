import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { debounce, interval, Observable, Subscription } from 'rxjs';
import { Blog, BlogService } from './blog.service';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements AfterViewInit, OnDestroy, OnInit {
  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;
  scrollSubscription: Subscription | null;
  blogs$: Observable<Blog[]>;

  constructor(private blogService: BlogService) {
    this.scrollSubscription = null;
    this.blogs$ = new Observable<Blog[]>();
  }

  ngOnInit(): void {
    this.blogs$ = this.blogService.getBlogs();
  }

  ngOnDestroy(): void {
    this.scrollSubscription?.unsubscribe();
  }

  ngAfterViewInit(): void {
    this.scrollSubscription = this.viewport.scrolledIndexChange.pipe(debounce(i => interval(25))).subscribe({
      next: (i) => {
        const end = this.viewport.getRenderedRange().end;
        const total = this.viewport.getDataLength();
        if (end === total && end !== 0) {
          this.blogService.nextPage();
        }
      }
    });
  }
}

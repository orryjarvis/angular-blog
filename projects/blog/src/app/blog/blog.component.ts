import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, combineLatest, filter, first, mergeMap, Observable, scan } from 'rxjs';
import { Blog, BlogManifest, BlogService } from './blog.service';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  blogs$: Observable<Blog[]>;
  blogManifest$: BehaviorSubject<BlogManifest | null>;

  constructor(private blogService: BlogService) {
    this.blogs$ = new Observable<Blog[]>();
    this.blogManifest$ = new BehaviorSubject<BlogManifest | null>(null);
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
    this.nextManifest();
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

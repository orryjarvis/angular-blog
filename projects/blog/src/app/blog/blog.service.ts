import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { defer, from, map, mergeMap, Observable, first, BehaviorSubject, filter, combineLatest, scan, Subscription, partition, merge, take } from 'rxjs';
import { VFile } from 'vfile';
import { Map } from 'immutable';
import { MarkdownService } from '../markdown/markdown.service';
import { isNonNull } from '../utils';

const getBlogUrl = (title: string) => `/assets/blog/post/${title}.md`;
const getBlogManifestUrl = (manifest: string = "blog-manifest-0") => `/assets/blog/${manifest}.json`;

declare module 'vfile' {
  interface VFileDataMap {
    matter: {
      title: string;
      date: string;
      image: string;
    }
  }
}

export interface Blog {
  html: string;
  title: string;
  fileName: string;
  date: Date;
  image: string;
}

interface BlogManifest {
  posts: { file: string }[];
  continuation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService implements OnDestroy {

  private blogManifestSubject$: BehaviorSubject<BlogManifest | null>;
  private blogManifest$: Observable<BlogManifest>;
  private blogList$: BehaviorSubject<Blog[]>;
  private blogCache$: BehaviorSubject<Map<string, Blog>>;
  // private blogAdHoc$: BehaviorSubject<Blog[]>;
  private blogsSubscription: Subscription;


  constructor(private httpClient: HttpClient, private markdownService: MarkdownService) {
    this.blogManifestSubject$ = new BehaviorSubject<BlogManifest | null>(null);
    this.blogManifest$ = this.blogManifestSubject$.pipe(filter(isNonNull));
    this.blogList$ = new BehaviorSubject<Blog[]>([]);
    this.blogCache$ = new BehaviorSubject<Map<string, Blog>>(Map());
    // this.blogAdHoc$ = new BehaviorSubject<Blog[]>([]);

    this.blogsSubscription = this.blogManifest$
      .pipe(
        mergeMap(manifest => combineLatest(manifest.posts.map(post => this.fetch(post.file)))),
        scan((acc, value) => [...acc, ...value])
      ).subscribe(blogs => {
        this.blogList$.next(blogs);
        this.blogCache$.next(Map(blogs.map(blog => [blog.fileName, blog])));
      });

    // merge(
    //   this.blogManifest$.pipe(mergeMap(manifest => combineLatest(manifest.posts.map(post => this.fetch(post.file))))),
    //   this.blogAdHoc$)
    //   .pipe(
    //     scan<Blog[], Map<string, Blog>>(
    //       (acc, value) => acc.merge(Map(value.map(blog => [blog.fileName, blog]))),
    //       Map<string, Blog>()
    //     )
    //   );
  }

  ngOnDestroy(): void {
    this.blogsSubscription.unsubscribe();
  }

  private initializeManifest(): void {
    const prev = this.blogManifestSubject$.value;
    if (!prev) {
      this.nextPage();
    }
  }

  nextPage(): void {
    const prev = this.blogManifestSubject$.value;
    if (!prev) {
      this.fetchManifest().pipe(first()).subscribe({
        next: manifest => this.blogManifestSubject$.next(manifest)
      });
    } else if (!prev.continuation) {
      this.blogManifestSubject$.complete();
    }
    else {
      this.fetchManifest(prev).pipe(first()).subscribe({
        next: manifest => this.blogManifestSubject$.next(manifest)
      });
    }
  }

  getBlogs(): Observable<Blog[]> {
    this.initializeManifest();
    return this.blogList$;
  }

  getBlog(fileName: string): Observable<Blog> {
    const [blog, empty] = partition(this.blogCache$.pipe(map(map => map.get(fileName)), take(1)), isNonNull);
    const fetched = empty.pipe(mergeMap(() => this.fetch(fileName)));
    const merged = merge(blog, fetched).pipe(take(1));
    // merged.subscribe(blog => this.blogAdHoc$.next([blog]));
    return merged;
  }

  private fetch(fileName: string): Observable<Blog> {
    return this.httpClient
      .get(getBlogUrl(fileName), { responseType: 'text' })
      .pipe(
        mergeMap(markdown => defer(() => from(this.markdownService.transformMarkdown(markdown)))),
        map(file => this.parseBlogMetadata(file, fileName))
      );
  }

  private fetchManifest(previous?: BlogManifest): Observable<BlogManifest> {
    return this.httpClient
      .get<BlogManifest>(getBlogManifestUrl(previous?.continuation));
  }

  private parseBlogMetadata(file: VFile, fileName: string): Blog {
    return {
      html: file.toString(),
      fileName,
      title: file.data.matter?.title ?? 'Title',
      date: file.data.matter?.date ? new Date(Date.parse(file.data.matter.date)) : new Date(),
      image: file.data.matter?.image ?? 'atom.svg'
    }
  }
}

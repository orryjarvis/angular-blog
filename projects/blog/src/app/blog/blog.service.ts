import { HttpClient } from '@angular/common/http';
import { Injectable, OnDestroy } from '@angular/core';
import { defer, from, map, mergeMap, Observable, first, BehaviorSubject, filter, combineLatest, scan, Subscription } from 'rxjs';
import { VFile } from 'vfile';
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

export interface BlogManifest {
  posts: { file: string }[];
  continuation?: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService implements OnDestroy {

  private blogManifestSubject$: BehaviorSubject<BlogManifest | null>;
  blogManifest$: Observable<BlogManifest>;
  private blogsSubject$: BehaviorSubject<Blog[]>;
  blogs$: Observable<Blog[]>;
  blogMap: Map<string, Blog>;
  private blogMapSubscription: Subscription;
  private blogsSubscription: Subscription;

  constructor(private httpClient: HttpClient, private markdownService: MarkdownService) {
    this.blogManifestSubject$ = new BehaviorSubject<BlogManifest | null>(null);
    this.blogManifest$ = this.blogManifestSubject$.pipe(filter(isNonNull));
    this.blogsSubject$ = new BehaviorSubject<Blog[]>([]);
    this.blogsSubscription = this.blogManifest$
      .pipe(
        mergeMap(manifest => combineLatest(manifest.posts.map(post => this.fetch(post.file)))),
        scan((acc, value) => [...acc, ...value])
      ).subscribe(blogs => this.blogsSubject$.next(blogs));
    this.blogs$ = this.blogsSubject$.asObservable();
    this.blogMap = new Map();
    this.blogMapSubscription = this.blogs$.subscribe(blogs => {
      this.blogMap = new Map(blogs.map(blog => [blog.fileName, blog]));
    });
  }

  ngOnDestroy(): void {
    this.blogMapSubscription.unsubscribe();
    this.blogsSubscription.unsubscribe();
  }

  initializeManifest(): void {
    const prev = this.blogManifestSubject$.value;
    if (!prev) {
      this.nextManifest();
    }
  }

  nextManifest(): void {
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

import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { catchError, mergeMap, Observable, throwError } from 'rxjs';
import { Blog, BlogService } from '../blog.service';

@Component({
  selector: 'blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.scss']
})
export class BlogPostComponent implements OnInit {
  public blog$: Observable<Blog>;

  constructor(private router: Router, private route: ActivatedRoute, private blogService: BlogService) {
    this.blog$ = new Observable<Blog>();
  }

  ngOnInit(): void {
    this.blog$ = this.route.params.pipe(mergeMap(params => this.blogService.fetch(params['id'])),
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.NotFound) {
          this.router.navigateByUrl('404');
        }
        return throwError(() => error);
      }));
  }
}

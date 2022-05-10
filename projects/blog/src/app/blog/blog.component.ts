import { Component, OnInit } from '@angular/core';
import { combineLatest, Observable } from 'rxjs';
import { Blog, BlogService } from './blog.service';

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent implements OnInit {
  blogs$: Observable<Blog[]>;

  constructor(private blogService: BlogService) {
    this.blogs$ = new Observable<Blog[]>();
  }

  ngOnInit(): void {
    this.blogs$ = combineLatest([
      this.blogService.fetch('first-post'),
      this.blogService.fetch('second'),
      this.blogService.fetch('something'),
      this.blogService.fetch('click-here')
    ]);
  }

}

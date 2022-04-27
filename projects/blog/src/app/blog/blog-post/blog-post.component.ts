import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'blog-blog-post',
  templateUrl: './blog-post.component.html',
  styleUrls: ['./blog-post.component.less']
})
export class BlogPostComponent implements OnInit {
  public post$: Observable<string>;

  constructor(private route: ActivatedRoute) {
    this.post$ = new Observable<string>();
  }

  ngOnInit(): void {
    this.post$ = this.route.params.pipe(map(params => `./assets/blog/post/${params['id']}.md`));
  }
}

import { Component } from '@angular/core';

@Component({
  selector: 'blog-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  date: Date = new Date();
}

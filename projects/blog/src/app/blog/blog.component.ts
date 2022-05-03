import { Component } from '@angular/core';

interface Blog {
  image: string;
  title: string;
  date: Date;
}

@Component({
  selector: 'blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.scss']
})
export class BlogComponent {
  blogs: Blog[];

  constructor() {
    this.blogs = [
      {
        image: "atom.svg",
        title: "first-post",
        date: new Date()
      },
      {
        image: "atom.svg",
        title: "first-post",
        date: new Date()
      },
      {
        image: "atom.svg",
        title: "first-post",
        date: new Date()
      },
      {
        image: "atom.svg",
        title: "first-post",
        date: new Date()
      }
    ];
  }
}

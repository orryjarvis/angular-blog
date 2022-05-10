import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogPostRoutingModule } from './blog-post-routing.module';
import { BlogPostComponent } from './blog-post.component';


@NgModule({
  declarations: [
    BlogPostComponent
  ],
  imports: [
    CommonModule,
    BlogPostRoutingModule,
  ]
})
export class BlogPostModule { }

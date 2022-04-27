import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogPostRoutingModule } from './blog-post-routing.module';
import { BlogPostComponent } from './blog-post.component';
import { MarkdownModule } from 'ngx-markdown';


@NgModule({
  declarations: [
    BlogPostComponent
  ],
  imports: [
    CommonModule,
    BlogPostRoutingModule,
    MarkdownModule.forChild()
  ]
})
export class BlogPostModule { }
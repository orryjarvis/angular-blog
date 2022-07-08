import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogPostRoutingModule } from './blog-post-routing.module';
import { BlogPostComponent } from './blog-post.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    BlogPostComponent
  ],
  imports: [
    CommonModule,
    BlogPostRoutingModule,
    MatProgressSpinnerModule,
  ]
})
export class BlogPostModule { }

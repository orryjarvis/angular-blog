import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BlogRoutingModule } from './blog-routing.module';
import { BlogComponent } from './blog.component';
import { MarkdownModule } from 'ngx-markdown';
import { MatListModule } from '@angular/material/list';


@NgModule({
  declarations: [
    BlogComponent
  ],
  imports: [
    CommonModule,
    BlogRoutingModule,
    MarkdownModule.forChild(),
    MatListModule
  ]
})
export class BlogModule { }

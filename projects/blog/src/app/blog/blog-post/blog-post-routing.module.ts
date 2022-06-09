import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogTitleResolver } from './blog-post-title.resolver';
import { BlogPostComponent } from './blog-post.component';

const routes: Routes = [
  { path: '', redirectTo: '/blog', pathMatch: 'full' },
  { path: ':id', component: BlogPostComponent, pathMatch: 'full', title: BlogTitleResolver }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogPostRoutingModule { }

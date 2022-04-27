import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlogComponent } from './blog.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', component: BlogComponent },
  { path: 'post', loadChildren: () => import('./blog-post/blog-post.module').then(m => m.BlogPostModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BlogRoutingModule { }

import { Injectable } from "@angular/core";
import { BlogService } from "../blog.service";
import { ActivatedRouteSnapshot } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class BlogTitleResolver {

  constructor(private blogService: BlogService) { }

  resolve(route: ActivatedRouteSnapshot): Promise<string> {
    return Promise.resolve(this.blogService.blogMap.get(route.params['id'])?.title ?? '');
  }
}

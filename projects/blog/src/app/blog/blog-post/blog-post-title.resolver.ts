import { Injectable } from "@angular/core";
import { BlogService } from "../blog.service";
import { ActivatedRouteSnapshot } from "@angular/router";
import { firstValueFrom, map } from "rxjs";

@Injectable({ providedIn: 'root' })
export class BlogTitleResolver {

  constructor(private blogService: BlogService) { }

  resolve(route: ActivatedRouteSnapshot): Promise<string> {
    return firstValueFrom(this.blogService.getBlog(route.params['id']).pipe(map(blog => blog.title)));
  }
}

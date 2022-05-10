import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { defer, from, map, mergeMap, Observable } from 'rxjs';
import { VFile } from 'vfile';
import { MarkdownService } from '../markdown/markdown.service';

const getBlogUrl = (title: string) => `./assets/blog/post/${title}.md`;

declare module 'vfile' {
  interface VFileDataMap {
    matter: {
      title: string;
      date: string;
      image: string;
    }
  }
}

export interface Blog {
  html: string;
  title: string;
  date: Date;
  image: string;
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  constructor(private httpClient: HttpClient, private markdownService: MarkdownService) { }

  fetch(title: string): Observable<Blog> {
    return this.httpClient
      .get(getBlogUrl(title), { responseType: 'text' })
      .pipe(
        mergeMap(markdown => defer(() => from(this.markdownService.transformMarkdown(markdown)))),
        map(file => this.parseBlogMetadata(file))
      );
  }

  private parseBlogMetadata(file: VFile): Blog {
    return {
      html: file.toString(),
      title: file.data.matter?.title ?? 'Title',
      date: file.data.matter?.date ? new Date(Date.parse(file.data.matter.date)) : new Date(),
      image: file.data.matter?.image ?? 'atom.svg'
    }
  }
}

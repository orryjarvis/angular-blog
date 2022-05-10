import { Injectable } from '@angular/core';
import { FrozenProcessor, Plugin, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { matter } from 'vfile-matter';
import { VFile } from 'vfile';

@Injectable({
  providedIn: 'root'
})
export class MarkdownService {

  private processor: FrozenProcessor;

  constructor() {
    this.processor = unified()
      .use(remarkParse)
      .use(this.getFrontMatterExtractionPlugin())
      .use(remarkFrontmatter)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSanitize)
      .use(rehypeStringify)
      .freeze();
  }

  async transformMarkdown(markdown: string): Promise<VFile> {
    return await this.processor.process(markdown);
  }

  private getFrontMatterExtractionPlugin(): Plugin {
    return (options) => function (tree: any, data: VFile) {
      matter(data);
    }
  }
}

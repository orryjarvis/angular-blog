import { promises as fs } from 'fs';
import * as path from 'path';
import { Plugin, unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkFrontmatter from 'remark-frontmatter';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeSanitize from 'rehype-sanitize';
import rehypeStringify from 'rehype-stringify';
import { matter } from 'vfile-matter';
import { VFile } from 'vfile';

const blogRoot = './projects/blog/src/assets/blog/';
const blogPostDir = 'post';
const blogPostFullDir = path.join(blogRoot, blogPostDir);

declare module 'vfile' {
  interface VFileDataMap {
    matter: {
      title: string;
      date: string;
      image: string;
    }
  }
}

interface PostMetadata {
  file: string;
  date: string;
  image: string;
  title: string;
  excerpt: string;
}

interface BlogManifest {
  posts: PostMetadata[];
  continuation?: string;
}

function getFrontMatterExtractionPlugin(): Plugin {
  return (options) => function (tree: any, data: VFile) {
    matter(data);
  }
}

async function getMetadata(file: string): Promise<PostMetadata> {
  const fullPath = path.join(blogPostFullDir, file);
  const stringified = await fs.readFile(fullPath);
  const excerpt = await unified()
    .use(remarkParse)
    .use(getFrontMatterExtractionPlugin())
    .use(remarkFrontmatter)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypeSanitize)
    .use(rehypeStringify)
    .process(stringified);
  return {
    file: path.parse(file).name,
    date: excerpt.data.matter?.date ?? new Date().toDateString(),
    image: excerpt.data.matter?.image ?? 'atom.svg',
    title: excerpt.data.matter?.title ?? 'Generated Title',
    excerpt: excerpt.toString()
  }
}


async function generate() {
  console.log('Parsing blog posts...');
  const metadataArray = await Promise.all((await fs.readdir(blogPostFullDir)).map(file => getMetadata(file)));

  console.log('Sorting blog posts...');
  const sorted = metadataArray.sort((a, b) => {
    return Date.parse(b.date) > Date.parse(a.date) ? 1 : -1;
  });

  console.log('Forming manifests...');
  const manifests = new Array<BlogManifest>();
  const pageSize = 8;
  for (let i = 0; i < sorted.length; i += pageSize) {
    const page = sorted.slice(i, i + pageSize);
    manifests.push({
      posts: page
    });
  }

  console.log('Deleting previous manifests...');
  const oldManifests = (await fs.readdir(blogRoot)).filter(file => file != blogPostDir).map(file => path.join(blogRoot, file));
  await Promise.all(oldManifests.map(file => {
    return fs.unlink(file);
  }));

  console.log('Writing manifests...');
  const getBlogManifestNameByIndex = (i: number) => `blog-manifest-${i}.json`;
  await Promise.all(manifests.map((manifest, index) => {
    if (index < manifests.length - 1) {
      manifest.continuation = getBlogManifestNameByIndex(index + 1).replace('.json', '');
    }
    return fs.writeFile(path.join(blogRoot, getBlogManifestNameByIndex(index)), JSON.stringify(manifest));
  }));
  console.log('Done.')
}

generate()

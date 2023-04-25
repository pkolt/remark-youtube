import { describe, it } from 'node:test';
import assert from 'node:assert';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkYoutube from './index.js';

const markdown1 = '# Header\n\nNew Paragraph\n\nhttps://youtu.be/enTFE2c68FQ\n\n';
const markdown2 = '# Header\n\nNew Paragraph\n\nhttps://www.youtube.com/watch?v=enTFE2c68FQ\n\n';

describe('transform youtube link to iframe player', () => {
  it('type is link (youtu.be)', async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkYoutube)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown1);
    assert.match(String(file), /<iframe/);
  });

  it('type is link (youtube.com)', async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkYoutube)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown2);
    assert.match(String(file), /<iframe/);
  });

  it('type is text (youtu.be)', async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkYoutube)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown1);
    assert.match(String(file), /<iframe/);
  });

  it('type is text (youtube.com)', async () => {
    const file = await unified()
      .use(remarkParse)
      .use(remarkYoutube)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(markdown2);
    assert.match(String(file), /<iframe/);
  });
});

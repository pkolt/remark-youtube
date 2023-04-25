import { describe, it } from 'node:test';
import assert from 'node:assert';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkYoutube from './index.js';

describe('transform youtube link to iframe player', () => {
  it('link from youtu.be', async () => {
    const input = '# Header\n\nNew Paragraph\n\nhttps://youtu.be/enTFE2c68FQ\n\n';
    const file = await unified()
      .use(remarkParse)
      .use(remarkYoutube)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(input);
    assert.match(String(file), /<iframe/);
  });

  it('link from youtube.com', async () => {
    const input = '# Header\n\nNew Paragraph\n\nhttps://www.youtube.com/watch?v=enTFE2c68FQ\n\n';
    const file = await unified()
      .use(remarkParse)
      .use(remarkYoutube)
      .use(remarkRehype)
      .use(rehypeStringify)
      .process(input);
    assert.match(String(file), /<iframe/);
  });
});

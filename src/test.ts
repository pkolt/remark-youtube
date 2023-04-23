import { describe, it } from 'node:test';
import assert from 'node:assert';
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import rehypeStringify from 'rehype-stringify';
import remarkYoutube from './index.js';

describe('transform youtube link to iframe player', () => {
  it('link from youtu.be', async () => {
    const input = 'youtube:https://youtu.be/enTFE2c68FQ';
    const file = await remark().use(remarkYoutube).use(remarkRehype).use(rehypeStringify).process(input);
    assert.match(String(file), /<iframe/);
  });

  it('link from youtube.com', async () => {
    const input = 'youtube:https://www.youtube.com/watch?v=enTFE2c68FQ';
    const file = await remark().use(remarkYoutube).use(remarkRehype).use(rehypeStringify).process(input);
    assert.match(String(file), /<iframe/);
  });
});

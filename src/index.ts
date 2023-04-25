import type { Root, Text } from 'mdast';
import { visit } from 'unist-util-visit';

const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 315;
const URL_PATTERN = /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)(\w+)$/;

interface Options {
  width?: number;
  height?: number;
}

const remarkYoutubePlugin = (options?: Options) => (tree: Root) => {
  visit(tree, 'paragraph', (node) => {
    let id = '';
    let value = '';
    for (const child of node.children) {
      if (child.type === 'text') {
        const match = child.value.match(URL_PATTERN);
        if (match && match[1]) {
          id = match[1];
          value = child.value;
          break;
        }
      }
    }

    if (id && value) {
      const text: Text = {
        type: 'text',
        value: value,
        data: {
          hName: 'iframe',
          hProperties: {
            width: options?.width ?? DEFAULT_WIDTH,
            height: options?.height ?? DEFAULT_HEIGHT,
            src: `https://www.youtube.com/embed/${id}?controls=0`,
            frameborder: '0',
            allowfullscreen: true,
          },
          hChildren: [],
        },
      };
      node.children = [text];
    }
  });
};

export default remarkYoutubePlugin;

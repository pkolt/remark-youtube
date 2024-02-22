import type { Root, Text, Link } from 'mdast';
import { visit } from 'unist-util-visit';

const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 315;
const URL_PATTERN = /^https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)$/;

interface Options {
  width?: number;
  height?: number;
}

const remarkYoutubePlugin = (options?: Options) => (tree: Root) => {
  visit(tree, 'paragraph', (node) => {
    let videoId = '';
    let videoUrl = '';
    for (const child of node.children) {
      // parse type = 'link' for 'remark-gfm'
      if (child.type === 'text' || child.type === 'link') {
        const url = (child as Link)?.url ?? (child as Text)?.value;
        const match = url.match(URL_PATTERN);
        if (match && match[1]) {
          videoId = match[1];
          videoUrl = url;
          break;
        }
      }
    }

    if (videoId && videoUrl) {
      const text: Text = {
        type: 'text',
        value: videoUrl,
        data: {
          hName: 'iframe',
          hProperties: {
            width: options?.width ?? DEFAULT_WIDTH,
            height: options?.height ?? DEFAULT_HEIGHT,
            src: `https://www.youtube.com/embed/${videoId}`,
            frameborder: '0',
            allow:
              'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
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

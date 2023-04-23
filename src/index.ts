import type { Root } from 'mdast';
import type { ReplaceFunction } from 'mdast-util-find-and-replace';
import { findAndReplace } from 'mdast-util-find-and-replace';

const DEFAULT_WIDTH = 560;
const DEFAULT_HEIGHT = 315;
const URL_PATTERN = /youtube:https:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)(\w+)/;

interface Options {
  width?: number;
  height?: number;
}

const remarkYoutubePlugin = (options?: Options) => (tree: Root) => {
  const replaceLinkToIframe: ReplaceFunction = (_, id: string) => {
    return {
      type: 'text',
      value: id,
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
  };
  return findAndReplace(tree, URL_PATTERN, replaceLinkToIframe);
};

export default remarkYoutubePlugin;

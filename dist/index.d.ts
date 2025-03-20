import type { Root } from 'mdast';
interface Options {
    width?: string | number;
    aspectRatio?: string;
    responsive?: boolean;
    className?: string;
    noHardcodedSize?: boolean;
}
/**
 * A remark plugin to embed YouTube videos with responsive scaling
 * and custom aspect ratio support.
 */
declare const remarkYoutubePlugin: (options?: Options) => (tree: Root) => void;
export default remarkYoutubePlugin;

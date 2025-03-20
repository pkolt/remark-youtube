import type { Root, Text, Link, Paragraph, PhrasingContent, Parent } from 'mdast';
import { visit } from 'unist-util-visit';

interface Options {
  width?: string | number;
  aspectRatio?: string; // Format: '16:9', '4:3', etc.
  responsive?: boolean;
  className?: string;
  noHardcodedSize?: boolean; // New option to use youtube-container class
}

const DEFAULT_ASPECT_RATIO = '16:9';
const URL_PATTERNS = [
  /https?:\/\/(?:youtu\.be\/|www\.youtube\.com\/watch\?v=)([0-9A-Za-z_-]+)(?:[&?][^&?]*)*$/,
  /https?:\/\/(?:www\.youtube\.com\/embed\/)([0-9A-Za-z_-]+)(?:[&?][^&?]*)*$/
];

/**
 * Extract YouTube video ID from a URL string
 */
const extractVideoId = (text: string): string | null => {
  for (const pattern of URL_PATTERNS) {
    const match = text.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }
  return null;
};

/**
 * Create an iframe node for YouTube embedding
 */
const createIframeNode = (
  videoId: string,
  videoUrl: string,
  options: {
    className: string;
    width?: string | number;
    height?: number;
    responsive: boolean;
    style?: string;
  }
): PhrasingContent => {
  const { className, responsive, style } = options;
  
  const commonProps = {
    className,
    src: `https://www.youtube.com/embed/${videoId}`,
    frameBorder: '0',
    allow: 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share',
    allowFullScreen: true
  };
  
  const hProperties = responsive 
    ? { ...commonProps, style }
    : { ...commonProps, width: options.width, height: options.height };

  return {
    type: 'text',
    value: videoUrl,
    data: {
      hName: 'iframe',
      hProperties
    }
  };
};

/**
 * A remark plugin to embed YouTube videos with responsive scaling
 * and custom aspect ratio support.
 */
const remarkYoutubePlugin = (options: Options = {}) => (tree: Root) => {
  const {
    aspectRatio = DEFAULT_ASPECT_RATIO,
    responsive = true,
    className = 'youtube-iframe',
    noHardcodedSize = false
  } = options;

  // Extract ratio values
  const [width, height] = aspectRatio.split(':').map(Number);
  const ratio = (height / width) * 100;

  // Calculate dimensions for non-responsive mode
  const fixedWidth = options.width || '560';
  const fixedHeight = typeof fixedWidth === 'number' 
    ? Math.round(fixedWidth * (height / width)) 
    : Math.round(parseInt(fixedWidth as string, 10) * (height / width));

  /**
   * Transform a paragraph into a YouTube embed
   */
  const transformToYoutubeEmbed = (parent: Parent, videoId: string, videoUrl: string) => {
    if (noHardcodedSize) {
      // Use youtube-container class without any styling
      parent.data = {
        hName: 'div',
        hProperties: {
          className: 'youtube-container'
        }
      };

      // Create iframe without style properties
      const iframeNode = createIframeNode(videoId, videoUrl, {
        className,
        responsive: true,
        // No style specified - will be controlled by external CSS
      });

      // Replace all children with the iframe
      parent.children = [iframeNode];
    } else if (responsive) {
      // Create a wrapper with proper aspect ratio
      parent.data = {
        hName: 'div',
        hProperties: {
          className: 'youtube-wrapper',
          style: `position: relative; width: 100%; padding-bottom: ${ratio}%; height: 0; overflow: hidden;`
        }
      };

      // Create iframe with absolute positioning
      const iframeNode = createIframeNode(videoId, videoUrl, {
        className,
        responsive: true,
        style: 'position: absolute; top: 0; left: 0; width: 100%; height: 100%;'
      });

      // Replace all children with the iframe
      parent.children = [iframeNode];
    } else {
      // Create iframe with fixed dimensions
      const iframeNode = createIframeNode(videoId, videoUrl, {
        className,
        responsive: false,
        width: fixedWidth,
        height: fixedHeight
      });

      // Replace all children with the iframe
      parent.children = [iframeNode];
    }
  };

  // Process text nodes for YouTube URLs
  visit(tree, 'text', (node, index, parent) => {
    if (!parent || parent.type !== 'paragraph') return;
    
    // Try to extract video ID from text content
    const videoId = extractVideoId(node.value);
    if (!videoId) return;
    
    // Get the full original URL
    const videoUrl = node.value.trim();
    
    // Transform the paragraph into a YouTube embed
    transformToYoutubeEmbed(parent, videoId, videoUrl);
  });

  // Process link nodes for YouTube URLs
  visit(tree, 'link', (node, index, parent) => {
    if (!parent || parent.type !== 'paragraph') return;
    
    // Extract video ID from link URL
    const videoId = extractVideoId(node.url);
    if (!videoId) return;
    
    // Get the full original URL
    const videoUrl = node.url;
    
    // Transform the paragraph into a YouTube embed
    transformToYoutubeEmbed(parent, videoId, videoUrl);
  });
};

export default remarkYoutubePlugin;
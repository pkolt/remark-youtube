# remark-youtube ![](https://github.com/pkolt/remark-youtube/workflows/main/badge.svg)

Embed YouTube player in your Markdown.

Supports ESM modules 👍

## Install

1. Install plugin to your site:

```bash
npm i remark-youtube
```

2. Setup plugin:

```typescript
import { unified } from 'unified'
import remarkParse from 'remark-parse';
import remarkRehype from 'remark-rehype';
import remarkYoutube from 'remark-youtube';

const input = 'your markdown content';

unified()
    .use(remarkParse)
    .use(remarkYoutube)
    .use(remarkRehype)
    .process(input)
    .then((file) => {
        console.log(String(file))
    });
```

## Usage

```markdown
## Watch this video

https://youtu.be/enTFE2c68FQ

https://www.youtube.com/watch?v=enTFE2c68FQ
```

## License

  [MIT](LICENSE.md)

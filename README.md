# remark-youtube ![](https://github.com/pkolt/remark-youtube/workflows/main/badge.svg)

Embed a Youtube Video in your Markdown.

## Install

1. Install plugin to your site:

```bash
npm i remark-youtube
```

2. Setup plugin:

```typescript
import { remark } from 'remark';
import remarkRehype from 'remark-rehype';
import remarkYoutube from 'remark-youtube';

const input = 'your markdown content';

remark()
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

youtube:https://youtu.be/enTFE2c68FQ

youtube:https://www.youtube.com/watch?v=enTFE2c68FQ
```

## License

  [MIT](LICENSE.md)

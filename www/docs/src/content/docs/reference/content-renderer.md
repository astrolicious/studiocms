---
title: contentRenderer
description: A reference page for contentRenderer
---
### `contentRenderer`

- **Type:** `'marked'| 'markdoc' | 'astro'`
- **Default:** `marked`

`contentRenderer` is a string value that is used to determine how content should be rendered in the `astroStudioCMS`. This is used to setup your content data. The default value is `marked` but you can also use `markdoc`.

## Usage

```js title="astro.config.mjs"  {2}
  astroStudioCMS({
      contentRenderer: 'marked',
  })
```

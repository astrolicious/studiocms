---
title: markdocConfig
description: A reference page for markdocConfig
sidebar:
  order: 2.2
---

`markdocConfig` is an object that is used to determine how content should be rendered in `studiocms` while using the MarkDoc renderer.

## Usage

```js title="astro.config.mjs"  {3-7}
studioCMS({
  rendererConfig: {
    markdocConfig: {
      renderType: 'html',
      argParse: {},
      transformConfig: {}
    },
  }
}),
```

This property has the following options:

### `renderType`

- **Type:** `'html' | 'react-static' | markdocRenderer`

The MarkDoc content renderer type to use for rendering pages and posts can be `html`, `react-static` or a custom markdocRenderer.

### `argParse`

- **Type:** `markdocParserArgs | undefined`

The MarkDoc arguments to be used when parsing MarkDoc content

### `transformConfig`

- **Type:** `markdocTransformConfig | undefined`

The MarkDoc Transform configuration to use when parsing and transforming MarkDoc content

See the [MarkDoc Documentation](https://markdoc.dev/docs/config) for more information
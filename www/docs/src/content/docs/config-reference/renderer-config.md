---
title: rendererConfig
description: A reference page for rendererConfig
sidebar:
  order: 2
---

## `renderer`

The Markdown Content Renderer to use for rendering pages within StudioCMS

- **Type:** `'marked'` | `'markdoc'` | `'astro'` | `'mdx'` | `CustomRenderer`
- **Default:** `'marked'`

`renderer` determines how Markdown content should be rendered in `studioCMS`. This is used to setup your content data. The default value is `marked` but you can also use `markdoc` or `astro` which uses Astro's built-in Remark processor.

### Usage

```js title="astro.config.mjs"  {3}
  studioCMS({
      rendererConfig: {
        renderer: 'marked'
      },
  })
```

## `markedConfig`

`markedConfig` is an object that is used to determine how content should be rendered in the `studioCMS`. This is used to setup your content data.

### Usage

[see `markedConfig` for full options](/config-reference/marked-config)

## `markdocConfig`

`markdocConfig` is an object that is used to determine how content should be rendered in `studiocms` while using the MarkDoc renderer.

### Usage

[see `markdocConfig` for full options](/config-reference/markdoc-config)

## `mdxConfig`

`mdxConfig` is an object that is used to determine how content should be rendered in `studiocms` while using the MDX renderer.

### Usage

[see `mdxConfig` for full options](/config-reference/mdx-config)
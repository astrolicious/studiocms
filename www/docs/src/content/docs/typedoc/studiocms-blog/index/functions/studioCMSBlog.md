---
editUrl: false
next: true
prev: true
title: "studioCMSBlog"
---

> **studioCMSBlog**(`options`): `AstroDbIntegration`

# StudioCMS Blog Theme(Integration) 
## Powered by [`astro-theme-provider`](https://github.com/astrolicious/astro-theme-provider) by [Bryce Russell](https://github.com/BryceRussell)

This theme provides a Blog Index Page and RSS Feed for your StudioCMS Site as well as route handling for Blog Posts.

## Parameters

• **options**: `undefined` \| `UserOptions`\<`"studiocms-blog"`, `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`\>\>

## Returns

`AstroDbIntegration`

## Example

```ts
import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import studioCMS from '@astrolicious/studiocms';
import studioCMSBlog from '@astrolicious/studiocms-blog';

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  output: "server",
  adapter: ...
  integrations: [ 
    db(), // REQUIRED - `@astrojs/db` must be included in the integrations list
    studioCMS(), // REQUIRED - StudioCMS must be included in the integrations list
    studioCMSBlog({
      config: {
        title: "My StudioCMS Blog",
        description: "A Simple Blog build with Astro, Astrojs/DB, and StudioCMS.".
      },
    }), 
  ],
});
```

## Defined in

packages/studioCMSBlog/index.ts:39

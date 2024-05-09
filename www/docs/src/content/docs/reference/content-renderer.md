---
title: contentRenderer
description: A reference page for contentRenderer
---

`contentRenderer` is a string value that is used to determine how content should be rendered in the `Astro-Studio-CMS`. This is used to setup your content data. The default value is `marked` but you can also use `markdoc`.

## Usage

```js title="astro.config.mjs"  {14}
import { defineConfig } from "astro/config";
import astroStudioCMS from "@astrolicious/studiocms";
import db from '@astrojs/db';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: 'https://example.com',
  output: "server",
  adapter: node({ mode: 'standalone' }),
  integrations: [
          db(),
          astroStudioCMS({
              contentRenderer: 'marked',
          })
  ],
});
```

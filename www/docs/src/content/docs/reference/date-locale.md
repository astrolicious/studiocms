---
title: dateLocale
description: A reference page for dateLocale
---

`dateLocale` is a string value that is used to determine how dates should be formatted in the `Astro-Studio-CMS`.

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
            dateLocale: 'en-us',
        })
  ],
});
```

- **Type:** `string`
- **Default:** `en-us`

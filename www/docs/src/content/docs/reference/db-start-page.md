---
title: dbStartPage
description: A reference page for dbStartPage
---

`dbStartPage` is a boolean value that is used to determine if the start page should be injected into the `Astro-Studio-CMS`. This is used to setup your DB data.

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
              dbStartPage: true // DEFAULT - This injects a start page to setup your DB data.
          })
  ],
});

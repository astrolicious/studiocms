---
title: verbose
description: A reference page for verbose
---

`verbose` is a boolean value that is used to determine if verbose logging should be enabled in the `Astro-Studio-CMS`.
- **Type:** `boolean| undefined`
- **Default:** `true`
## Usage

```js title="astro.config.mjs"  {14}
import { defineConfig } from "astro/config";
import astroStudioCMS from "@astrolicious/studiocms";
import db from "@astrojs/db";
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  site: "https://example.com",
  output: "server",
  adapter: node({ mode: "standalone" }),
  integrations: [
    db(),
    astroStudioCMS({
      verbose: true, // DEFAULT - This enables verbose logging in the Astro-Studio-CMS.
    }),
  ],
});
```

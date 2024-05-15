---
title: includedIntegrations
description: A reference page for includedIntegrations
---

`includedIntegrations` is an object value that is used to determine which integrations should be included in the `Astro-Studio-CMS`. Currently there are three integrations that can be included: `useAstroRobots`, `astroRobotsConfig`, and `useInoxSitemap`.

## Usage

```js title="astro.config.mjs"  {14-18}

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
      includedIntegrations: {
        useAstroRobots: true,
        astroRobotsConfig: true,
        useInoxSitemap: true,
      },
    }),
  ],
});

```

### `useAstroRobots`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows the user to enable/disable the use of the Astro Robots Plugin.

### `astroRobotsConfig`

- **Type:** `RobotsConfig{} | undefined{}`

Let's you modify the default behavior of the this plugin. For more information on this plugin please visit the [Astro Robots Plugin](https://www.npmjs.com/package/astro-robots).

### `useInoxSitemap`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin. For more information on this plugin please visit the [Inox-tools Sitemap Plugin](https://inox-tools.vercel.app/sitemap-ext).
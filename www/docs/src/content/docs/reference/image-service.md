---
title: imageService
description: A reference page for Image Service
---

`imageService` is an object value that is used to determine how images should be rendered in the `Astro-Studio-CMS`. This is used to setup your image data.

## Usage

```js title="astro.config.mjs"  {14-23}
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
      imageService: {
        useUnpic: false,
        unpicConfig {
            fallbackService: "unsplash",
            placeholder: 'blurhash',
            layout: 'constrained',
        },
        astroImageServiceConfig: "squoosh",
        cdnPlugin: "cloudinary",
      },
    }),
  ],
});
```

### `useUnpic`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows the user to enable/disable the use of the `@unpic/astro` image optimization service for external images.

### `unpicConfig`

- **Type:** `unpicConfigSchema{} | undefined{}`
- **Default:** `undefined{}`

Allows the user to customize the `@unpic/astro` image optimization service.

#### `fallbackService`

- **Type:** `'sharp' | 'squoosh' | undefined`
- **Default:** `undefined`

Falls back to the value of `astroImageServiceConfig` if not set here.

#### `placeholder`

- **Type:** `'blurhash' | 'dominantColor' | 'lqlip' | undefined`
- **Default:** `'blurhash'`

The default placeholder background to use for images.

#### `layout`

- **Type:** `'constrained' | 'fixed' | 'fullWidth' | undefined`
- **Default:** `'constrained'`

The default layout to use for images. 

#### `cdnOptions`

- **Type:** `cdnOptionsSchema{} | undefined{}`
- **Default:** `undefined{}`

CDN-specific options for the `@unpic/astro` image optimization service.

### `astroImageServiceConfig`

- **Type:** `'sharp' | 'squoosh' | undefined`
- **Default:** `'squoosh'`

If the `useUnpic` option is enabled, this option allows the user to choose between the `sharp` and `squoosh` image optimization services.

### `cdnPlugin`

- **Type:** `'cloudinary-js'| undefined`
- **Default:** `'cloudinary-js'`

Allows the user to use a custom Supported CDN Plugin, so it can be specified here.


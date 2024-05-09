---
title: markedConfig
description: A reference page for markedConfig
---

`markedConfig` is an object value that is used to determine how content should be rendered in the `Astro-Studio-CMS`. This is used to setup your content data.

## Usage

```js title="astro.config.mjs"  {14-18}
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
        markedConfig: {
            highlighterConfig: {
                highlighter: 'disabled',
            },
        },
        }),
  ],
});
```

This property has the following options:

### `includeExtensions`

- **Type:** `markedExtensionsSchema{} | undefined{}`

This option allows you to enable or disable the included Marked Extensions, such as `marked-alert`, `marked-footnote`, `marked-smartypants`, and `marked-emoji`.

#### `markedAlert`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows you to enable/disable the use of the `marked-alert` extension

#### `markedFootnote`

- **Type:** `boolean | undefined`
- **Default:** `true`

Alows you to enable/disable the use of the `marked-footnote` extension

#### `markedSmartyPants`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows you to enable/disable the use of the `marked-smartypants` extension

#### `markedEmoji`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows you to enable/disable the use of the `marked-emoji` extension

### `highlighterConfig`

- **Type:** `markedHighlighterConfigSchema{} | undefined{}`

This option allows you to choose the highlighter to use for code blocks in your content.

#### `highlighter`

- **Type:** `Enum<'shiki' | 'disabled'> | undefined`
- **Default:** `'disabled'`

:::note
For the time being, the only available option is `shiki`.
:::

#### `shikiConfig`

- **Type:** `shikiConfigSchema{} | undefined{}`

This option allows you to configure the a `shiki` highlighter.

##### `theme`

- **Type:** : `string | undefined`
- **Default:** `'houston'`

Alows you to choose the theme for the `shiki` highlighter.

The only available themes are the ones listed below:

- `houston`
- `github-dark`
- `github-light`
- `night-owl`

##### `loadThemes`

- **Type:** `string | undefined`
- **Default:** `undefined`

Allows you to load additional Shiki Themes. This option is only used if you want to load additional Shiki Themes.

For example if you want to load the `material-theme-palenight` theme, you would set the `loadTheme` option to `['material-theme-palenight']`.

```ts
loadThemes: [ import('shiki/themes/material-theme-palenight'), ...asManyOtherThemesAsYouWant ]
```

##### `loadLang`

- **Type:** `string[] | undefined`
- **Default:** `undefined`

Allows you to load additional Shiki Languages. This option is only used if you want to load additional Shiki Languages.

For example if you want to load `rust` and `toml` languages, you would set the `loadLang` option to `['rust', 'toml']`.

```ts
loadLang: [import('shiki/languages/rust'), import('shiki/languages/toml') ...asManyOtherLanguagesAsYouWant]
```

### `loadMarkedExtensions`

- **Type:** `string[] | undefined`
- **Default:** `undefined`

Allows you to load additional Marked Extensions. This is only used if the user wants to load additional [Marked Extensions](https://marked.js.org/using_advanced#extensions).

For example if you want to load Admonitions, you would need to install the `npm package`, import it in your config and then declare it.

```ts
import markedAlert from 'marked-alert'

loadMarkedExtensions: [markedAlert()]
```

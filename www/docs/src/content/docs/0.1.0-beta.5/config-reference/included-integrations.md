---
title: includedIntegrations
description: A reference page for includedIntegrations
sidebar:
  order: 5
slug: 0.1.0-beta.5/config-reference/included-integrations
---

`includedIntegrations` is an object that is used to determine which Astro Integrations should be included in the `astroStudioCMS`. Currently there are three Integrations that can be included: `useAstroRobots`, `astroRobotsConfig`, and `useInoxSitemap`.

## Usage

```js title="astro.config.mjs"  {2-6}
astroStudioCMS({
  includedIntegrations: {
    useAstroRobots: true,
    astroRobotsConfig: {},
    useInoxSitemap: true,
  },
}),
```

### `useAstroRobots`

* **Type:** `boolean | undefined`
* **Default:** `true`

Allows the user to enable/disable the use of the StudioCMS Custom `astro-robots-txt` Integration.

### `astroRobotsConfig`

* **Type:** `RobotsConfig{} | undefined{}`

Allows you to modify the default behaviour of the this Integration. For more information on this Integration please visit the [Astro Robots Integration](https://www.npmjs.com/package/astro-robots).

### `useInoxSitemap`

#### TEMPORARILY DISABLED

If you would like to still use the Inox-tools Sitemap Plugin, you can manually add it to your project's Integrations.

* **Type:** `boolean | undefined`
* **Default:** `true`

Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin. For more information on this Integration please visit the [Inox-tools Sitemap Integration](https://inox-tools.vercel.app/sitemap-ext).

---
title: includedIntegrations
description: A reference page for includedIntegrations
---

`includedIntegrations` is an object that is used to determine which Astro Integrations should be included in the `astroStudioCMS`. Currently there are three Integrations that can be included: `useAstroRobots`, `astroRobotsConfig`, and `useInoxSitemap`.

## Usage

```js title="astro.config.mjs"  {2-6}
astroStudioCMS({
  includedIntegrations: {
    useAstroRobots: true,
    astroRobotsConfig: true,
    useInoxSitemap: true,
  },
}),
```

### `useAstroRobots`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows the user to enable/disable the use of the Astro Robots Integration.

### `astroRobotsConfig`

- **Type:** `RobotsConfig{} | undefined{}`

Allows you to modify the default behaviour of the this Integration. For more information on this Integration please visit the [Astro Robots Integration](https://www.npmjs.com/package/astro-robots).

### `useInoxSitemap`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin. For more information on this Integration please visit the [Inox-tools Sitemap Integration](https://inox-tools.vercel.app/sitemap-ext).
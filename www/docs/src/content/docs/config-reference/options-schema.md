---
title: StudioCMSOptionsSchema
description: Reference page for StudioCMSOptionsSchema
sidebar:
  order: 1
---

StudioCMS Integration config options schema Reference

## `dbStartPage`

Project Initialization Page - Used during First time setup to create your database configuration.

- **Type:** `boolean`
- **Default:** `true`

`dbStartPage` is a boolean value that is used to determine if the start page should be injected into the `astroStudioCMS`. This is used to setup your DB data.

### Usage

```js title="astro.config.mjs" {2}
studioCMS({
    dbStartPage: true, // DEFAULT - This injects a start page to setup your DB data.
})
```

## `contentRenderer`

The Markdown Content Renderer to use for rendering pages within StudioCMS

- **Type:** `'marked'` | `'markdoc'` | `'astro'`
- **Default:** `'marked'`

`contentRenderer` is a string value that is used to determine how content should be rendered in the `astroStudioCMS`. This is used to setup your content data. The default value is `marked` but you can also use `markdoc` or `astro`'s built in Remark processor.

### Usage

```js title="astro.config.mjs"  {2}
  astroStudioCMS({
      contentRenderer: 'marked',
  })
```

## `markedConfig`

`markedConfig` is an object that is used to determine how content should be rendered in the `astroStudioCMS`. This is used to setup your content data.

### Usage

[see `markedConfig` for full options](/config-reference/marked-config)

## `imageService`

`imageService` is an object value that is used to determine how images should be rendered in the `astroStudioCMS`. This is used to setup your image data.

### Usage

[see `imageService` for full options](/config-reference/image-service)

## `defaultFrontEndConfig`

`defaultFrontEndConfig` is an object value that is used to determine how the default dashboard routes should be rendered in `astroStudioCMS`. This is used to setup your user facing front-end.

### Usage

[see `defaultFrontEndConfig` for full options](/config-reference/default-frontend-config)

## `dashboardConfig`

`dashboardConfig` option let's customize the dashboard for the `astroStudioCMS`. This is used to setup your dashboard data.

### Usage

[see `dashboardConfig` for full options](/config-reference/dashboard)

## `includedIntegrations`

`includedIntegrations` is an object that is used to determine which Astro Integrations should be included in the `astroStudioCMS`. Currently there are three Integrations that can be included: `useAstroRobots`, `astroRobotsConfig`, and `useInoxSitemap`.

### Usage

[see `includedIntegrations` for full options](/config-reference/included-integrations)

## `dateLocale`

Date locale used for formatting dates

- **Type:** `string`
- **Default:** `en-us`

`dateLocale` is a string value that is used to determine how dates should be formatted in the `astroStudioCMS`.

### Usage

```js title="astro.config.mjs"  {2}
astroStudioCMS({
    dateLocale: 'en-us',
})
```

## `overrides`

`overrides` is an object that is used to override the default configuration of the `astroStudioCMS`.

### Usage

[see `overrides` for full options](/config-reference/overrides)

## `verbose`

- **Type:** `boolean| undefined`
- **Default:** `true`

`verbose` is a boolean value that is used to determine if verbose logging should be enabled in the `astroStudioCMS`.

### Usage

```js title="astro.config.mjs"  {2}
astroStudioCMS({
  verbose: true, // DEFAULT - This enables verbose logging in the Astro-Studio-CMS.
}),
```
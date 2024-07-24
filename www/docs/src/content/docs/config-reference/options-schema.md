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

`dbStartPage` Should the Start page be injected into the `astroStudioCMS`. This is used to setup your DB data.

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

`imageService` lets you configure your which service you're using for Images.

### Usage

[see `imageService` for full options](/config-reference/image-service)

## `defaultFrontEndConfig`

`defaultFrontEndConfig` Determines how the default Dashboard routes should be rendered in `astroStudioCMS`. This is used to setup your user facing front-end.

### Usage

[see `defaultFrontEndConfig` for full options](/config-reference/default-frontend-config)

## `dashboardConfig`

`dashboardConfig` option lets you customize the dashboard for `astroStudioCMS`. This is used to setup your dashboard data.

### Usage

[see `dashboardConfig` for full options](/config-reference/dashboard)

## `includedIntegrations`

`includedIntegrations` defines which Astro Integrations should be included in `astroStudioCMS`. Currently there are three Integrations that can be included: `useAstroRobots`, `astroRobotsConfig`, and `useInoxSitemap`.

### Usage

[see `includedIntegrations` for full options](/config-reference/included-integrations)

## `dateLocale`

Date locale used for formatting dates

- **Type:** `string`
- **Default:** `en-us`

`dateLocale` specifies how dates should be formatted in `astroStudioCMS`.

### Usage

```js title="astro.config.mjs"  {2}
astroStudioCMS({
    dateLocale: 'en-us',
})
```

## `overrides`

`overrides` Used to override the default configuration of the `astroStudioCMS`.

### Usage

[see `overrides` for full options](/config-reference/overrides)

## `verbose`

- **Type:** `boolean| undefined`
- **Default:** `true`

`verbose` enables verbose logging.

### Usage

```js title="astro.config.mjs"  {2}
astroStudioCMS({
  verbose: true, // DEFAULT - This enables verbose logging in AstroStudioCMS.
}),
```
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

`dbStartPage` Should the Start page be injected into the `studioCMS`. This is used to setup your DB data.

### Usage

```js title="astro.config.mjs" {2}
studioCMS({
    dbStartPage: true, // DEFAULT - This injects a start page to setup your DB data.
})
```

## `rendererConfig`

`rendererConfig` is an object that is used to determine how content should be rendered in `studiocms`.

### Usage

[see `rendererConfig` for full options](/config-reference/renderer-config)

## `imageService`

`imageService` lets you configure your which service you're using for Images.

### Usage

[see `imageService` for full options](/config-reference/image-service)

## `defaultFrontEndConfig`

`defaultFrontEndConfig` Determines how the default Dashboard routes should be rendered in `studioCMS`. This is used to setup your user facing front-end.

### Usage

[see `defaultFrontEndConfig` for full options](/config-reference/default-frontend-config)

## `dashboardConfig`

`dashboardConfig` option lets you customize the dashboard for `studioCMS`. This is used to setup your dashboard data.

### Usage

[see `dashboardConfig` for full options](/config-reference/dashboard)

## `includedIntegrations`

`includedIntegrations` defines which Astro Integrations should be included in `studioCMS`. Currently there are three Integrations that can be included: `useAstroRobots`, `astroRobotsConfig`, and `useInoxSitemap`.

### Usage

[see `includedIntegrations` for full options](/config-reference/included-integrations)

## `dateLocale`

Date locale used for formatting dates

- **Type:** `string`
- **Default:** `en-us`

`dateLocale` specifies how dates should be formatted in `studioCMS`.

### Usage

```js title="astro.config.mjs"  {2}
astroStudioCMS({
    dateLocale: 'en-us',
})
```

## `overrides`

`overrides` Used to override the default configuration of the `studioCMS`.

### Usage

[see `overrides` for full options](/config-reference/overrides)

## `verbose`

- **Type:** `boolean| undefined`
- **Default:** `true`

`verbose` enables verbose logging.

### Usage

```js title="astro.config.mjs"  {2}
studioCMS({
  verbose: true, // DEFAULT - This enables verbose logging in studioCMS.
}),
```
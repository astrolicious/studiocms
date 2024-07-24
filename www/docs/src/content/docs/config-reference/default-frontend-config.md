---
title: defaultFrontEndConfig
description: A reference page for defaultFrontEndConfig
sidebar:
  order: 3
---

`defaultFrontEndConfig` is an object value that is used to determine how the default dashboard routes should be rendered in `astroStudioCMS`. This is used to setup your user facing front-end.

## Usage

```js title="astro.config.mjs" {2-9}
astroStudioCMS({
  defaultFrontEndConfig: {
    injectDefaultFrontEndRoutes: true,
    inject404Route: true,
    htmlDefaultLanguage: 'en',
    htmlDefaultHead: [],
    layoutOverride: '/src/layouts/customLayout.astro',
    favicon: '/favicon.svg',
  },
})
```

## `injectDefaultFrontEndRoutes`

Inject Default Routes - Injects the default routes for the StudioCMS Frontend

- **Type:** `boolean`
- **Default:** `true`

`injectDefaultFrontEndRoutes` is a boolean value that is used to determine if the user facing frontend routes should be injected into the `astroStudioCMS`.  This is used to setup your frontend routes

## `inject404Route`

Inject 404 Route - Injects a 404 route for handling unknown routes

- **Type:** `boolean`
- **Default:** `true`

`inject404Route` is a boolean value that is used to determine if the user facing frontend `404` route should be injected into the `astroStudioCMS`.  This is used to setup your frontend `404` route

## `htmlDefaultLanguage`

HTML Default Language - The default language for the HTML tag

- **Type:** `string`
- **Default:** `'en'`

`htmlDefaultLanguage` is a string value that is used to set the `lang` attribute of your `<html>` of the `astroStudioCMS` webpage.

## `htmlDefaultHead`

- **Type:** `Array`
- **Default:** `optional`

HTML Default Header - The default head configuration for the Frontend

### Usage


```js title="astro.config.mjs" {2-4}
astroStudioCMS({
    htmlDefaultHead: [
        { tag: 'title', content: 'My Awesome Site' }
    ],
})
```

## `layoutOverride`

Layout Override - Allows override of the default layout file

- **Type:** `string`
- **Default:** `optional`

## `favicon`

- **Type:** `string`
- **Default:** `/favicon.svg`

Favicon is relative to the project public folder

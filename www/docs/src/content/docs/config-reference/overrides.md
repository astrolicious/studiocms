---
title: overrides
description: A reference page for overrides
sidebar:
  order: 6
---

`overrides` is an object that is used to override the default configuration of the `astroStudioCMS`.

## Usage

```js title="astro.config.mjs"  {2-6}
astroStudioCMS({
  overrides: {
    CustomImageOverride: "./src/components/MyCustomImage.astro",
    FormattedDateOverride: "./src/components/MyCustomFormattedDate.astro",
  },
}),
```

### `CustomImageOverride`

- **Type:** `string | undefined`
- **Default:** `undefined`

The path to a custom image component that will be used to render images in the `Astro-Studio-CMS`.

### `FormattedDateOverride`

- **Type:** `string | undefined`
- **Default:** `undefined`

The path to a custom formatted date component that will be used to render dates in the `Astro-Studio-CMS`.

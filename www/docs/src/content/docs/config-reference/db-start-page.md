---
title: dbStartPage
description: A reference page for dbStartPage
---

- **Type:** `boolean`
- **Default:** `true`
- 
`dbStartPage` is a boolean value that is used to determine if the start page should be injected into the `astroStudioCMS`. This is used to setup your DB data.

## Usage

```js title="astro.config.mjs"  {2}
astroStudioCMS({
  dbStartPage: true, // DEFAULT - This injects a start page to setup your DB data.
})
```

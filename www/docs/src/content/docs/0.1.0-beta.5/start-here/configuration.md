---
title: StudioCMS Config
description: Options for how to define the StudioCMS Config
slug: 0.1.0-beta.5/start-here/configuration
---

# Available Options

There are two ways to configure the StudioCMS Integration, below are examples of how to configure based on if you choose to use the `astro.config.mjs` or the dedicated `studiocms.config.mjs` file.

## Using the `astro.config.mjs` file:

```js title="astro.config.mjs"
import db from '@astrojs/db';
import node from '@astrojs/node';
import studioCMS from 'studiocms';
import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://demo.astro-studiocms.xyz/',
    output: 'server',
    adapter: node({ mode: "standalone" }),
    integrations: [
        db(),
        studioCMS({
            dbStartPage: false,
            ...OtherConfigOptions
        }),
    ],
});
```

## Using the `studiocms.config.mjs` file:

This file will be automatically picked up and will overwrite any options passed in your astro.config, if you choose to use this option, Please ensure to move all StudioCMS Config options into this file instead like below:

```js title="astro.config.mjs"
import db from '@astrojs/db';
import node from '@astrojs/node';
import studioCMS from 'studiocms';
import { defineConfig } from 'astro/config';

export default defineConfig({
    site: 'https://demo.astro-studiocms.xyz/',
    output: 'server',
    adapter: node({ mode: "standalone" }),
    integrations: [ db(), studioCMS() ],
});
```

```js title="studiocms.config.mjs"
import { defineStudioCMSConfig } from "studiocms";

export default defineStudioCMSConfig({
    dbStartPage: false,
    ...OtherConfigoptions
})
```

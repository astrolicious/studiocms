---
editUrl: false
next: true
prev: true
title: "contentHelper"
---

> **contentHelper**(`slug`, `pkg`?): `Promise`\<[`ContentHelperTempResponse`](/typedoc/studiocms-core/utils/contenthelper/type-aliases/contenthelpertempresponse/)\>

A helper function to get the content of a page by its slug.

## Parameters

• **slug**: `string`

The slug of the page to get the content of. Defined in the PageData table.

• **pkg?**: `string`

The package to get the content from. Default is '@astrolicious/studiocms'.

## Returns

`Promise`\<[`ContentHelperTempResponse`](/typedoc/studiocms-core/utils/contenthelper/type-aliases/contenthelpertempresponse/)\>

The data and content of the page.

## Example

```astro
---
// Get the content of the index page:
import { StudioCMSRenderer, contentHelper } from 'studiocms:components'

const { title, description, heroImage, content } = await contentHelper("index", "@astrolicious/studiocms")
---

<h1>{title}</h1>
<p>{description}</p>
<img src={heroImage} alt={title} />
<StudioCMSRenderer content={content} />

```

## Defined in

packages/studioCMS/src/utils/contentHelper.ts:56

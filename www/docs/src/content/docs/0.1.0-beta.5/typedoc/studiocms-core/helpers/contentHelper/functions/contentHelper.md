---
editUrl: false
next: true
prev: true
title: contentHelper
slug: 0.1.0-beta.5/typedoc/studiocms-core/helpers/contenthelper/functions/contenthelper
---

> **contentHelper**(`slug`, `pkg`?): `Promise`\<[`ContentHelperTempResponse`](/0.1.0-beta.5/typedoc/studiocms-core/helpers/contenthelper/type-aliases/contenthelpertempresponse/)>

A helper function to get the content of a page by its slug.

## Parameters

• **slug**: `string`

The slug of the page to get the content of. Defined in the PageData table.

• **pkg?**: `string`

The package to get the content from. Default is '@astrolicious/studiocms'.

## Returns

`Promise`\<[`ContentHelperTempResponse`](/0.1.0-beta.5/typedoc/studiocms-core/helpers/contenthelper/type-aliases/contenthelpertempresponse/)>

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

[packages/studiocms\_core/src/helpers/contentHelper.ts:58](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/helpers/contentHelper.ts#L58)

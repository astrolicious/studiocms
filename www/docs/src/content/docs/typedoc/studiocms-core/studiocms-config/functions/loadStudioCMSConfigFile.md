---
editUrl: false
next: true
prev: true
title: "loadStudioCMSConfigFile"
---

> **loadStudioCMSConfigFile**(`projectRootUrl`): `Promise`\<[`StudioCMSOptions`](/typedoc/studiocms-core/index/type-aliases/studiocmsoptions/)\>

Attempts to import an StudioCMS  config file in the Astro project root and returns its default export.

If no config file is found, an empty object is returned.

## Parameters

• **projectRootUrl**: `string` \| `URL`

## Returns

`Promise`\<[`StudioCMSOptions`](/typedoc/studiocms-core/index/type-aliases/studiocmsoptions/)\>

## Defined in

packages/studioCMS/src/studiocms-config.ts:21

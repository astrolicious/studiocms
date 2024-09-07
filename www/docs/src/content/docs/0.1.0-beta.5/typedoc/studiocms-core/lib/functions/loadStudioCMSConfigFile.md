---
editUrl: false
next: true
prev: true
title: loadStudioCMSConfigFile
slug: 0.1.0-beta.5/typedoc/studiocms-core/lib/functions/loadstudiocmsconfigfile
---

> **loadStudioCMSConfigFile**(`projectRootUrl`): `Promise`\<[`StudioCMSOptions`](/0.1.0-beta.5/typedoc/studiocms-core/schemas/type-aliases/studiocmsoptions/)>

Attempts to import an StudioCMS  config file in the Astro project root and returns its default export.

If no config file is found, an empty object is returned.

## Parameters

• **projectRootUrl**: `string` | `URL`

## Returns

`Promise`\<[`StudioCMSOptions`](/0.1.0-beta.5/typedoc/studiocms-core/schemas/type-aliases/studiocmsoptions/)>

## Defined in

[packages/studiocms\_core/src/lib/configManager.ts:19](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/lib/configManager.ts#L19)

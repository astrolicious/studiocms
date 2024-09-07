---
editUrl: false
next: true
prev: true
title: astroDb
slug: 0.1.0-beta.5/typedoc/studiocms-dashboard/utils/astrodb/functions/astrodb
---

> **astroDb**(): `object`

## Returns

`object`

### pageContent()

#### Returns

`object`

##### delete()

###### Parameters

• **id**: `string`

###### Returns

`Promise`\<`void`>

##### insert()

###### Parameters

• **data**: `PageContentInsert`

###### Returns

`Promise`\<`void`>

##### update()

###### Parameters

• **data**: `PageContentUpdate`

###### Returns

`Promise`\<`void`>

### pageData()

#### Returns

`object`

##### delete()

###### Parameters

• **id**: `string`

###### Returns

`Promise`\<`void`>

##### getBySlug()

###### Parameters

• **slug**: `string`

• **pkg**: `string`

###### Returns

`Promise`\<`undefined` | `PageDataType`>

##### insertPageData()

###### Parameters

• **data**: `PageDataInsert`

###### Returns

`Promise`\<`undefined` | `PageDataReturnID`>

##### update()

###### Parameters

• **data**: `PageDataUpdate`

###### Returns

`Promise`\<`void`>

### siteConfig()

#### Returns

`object`

##### update()

###### Parameters

• **data**: `SiteConfigUpdate`

###### Returns

`Promise`\<`undefined` | `SiteConfigReturn`>

## Defined in

[packages/studiocms\_dashboard/src/utils/astroDb.ts:68](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_dashboard/src/utils/astroDb.ts#L68)

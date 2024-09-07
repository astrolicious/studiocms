---
editUrl: false
next: true
prev: true
title: DashboardPageLink
slug: 0.1.0-beta.5/typedoc/studiocms-core/types/pluginoptions/type-aliases/dashboardpagelink
---

> **DashboardPageLink**: `object`

## Type declaration

### dropdownChildren?

> `optional` **dropdownChildren**: [`DashboardPageLink`](/0.1.0-beta.5/typedoc/studiocms-core/types/pluginoptions/type-aliases/dashboardpagelink/)\[]

Dropdown items for dropdown links (Requires `type: 'dropdown'`)

### icon

> **icon**: `string`

Icon to display for the link ( icon: 'data:image/svg+xml;base64,PH...)

### label

> **label**: `string`

Label for the link

### link

> **link**: `string`

URL to redirect to

### minRole

> **minRole**: `"unknown"` | `"visitor"` | `"editor"` | `"admin"`

Minimum permission level required to view the link (unknown/visitor/editor/admin)

### type

> **type**: `"link"` | `"dropdown"`

Type of link (link/dropdown)

## Defined in

[packages/studiocms\_core/src/types/pluginOptions.ts:1](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/types/pluginOptions.ts#L1)

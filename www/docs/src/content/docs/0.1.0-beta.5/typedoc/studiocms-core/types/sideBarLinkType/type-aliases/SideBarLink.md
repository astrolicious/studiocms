---
editUrl: false
next: true
prev: true
title: SideBarLink
slug: 0.1.0-beta.5/typedoc/studiocms-core/types/sidebarlinktype/type-aliases/sidebarlink
---

> **SideBarLink**: `object`

## Type declaration

### dropdownItems?

> `optional` **dropdownItems**: [`SideBarLink`](/0.1.0-beta.5/typedoc/studiocms-core/types/sidebarlinktype/type-aliases/sidebarlink/)\[]

Dropdown items for dropdown links (Requires `type: 'dropdown'`)

### href

> **href**: `string`

URL to redirect to

### icon

> **icon**: `string`

Icon to display for the link ( icon: 'data:image/svg+xml;base64,PH...)

### id

> **id**: `string`

Unique link ID

### minPermissionLevel

> **minPermissionLevel**: `string`

Minimum permission level required to view the link (unknown/visitor/editor/admin)

### text

> **text**: `string`

Text to display for the link

### type

> **type**: `"link"` | `"dropdown"`

Type of link (link/dropdown)

## Param

The unique identifier for the link

## Param

The URL to redirect to

## Param

The text to display for the link

## Param

The minimum permission level required to view the link (unknown, visitor, editor, admin)

## Param

The icon to display for the link ( see https://shoelace.style/components/icon )

## Defined in

[packages/studiocms\_core/src/types/sideBarLinkType.ts:9](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/types/sideBarLinkType.ts#L9)

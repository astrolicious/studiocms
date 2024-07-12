---
editUrl: false
next: true
prev: true
title: "getUserById"
---

> **getUserById**(`userId`): `Promise`\<[`UserResponse`](/typedoc/studiocms-core/utils/contenthelper/type-aliases/userresponse/)\>

Get user by ID helper function to get a user by their ID from Astro Studio's Database.

## Parameters

• **userId**: `string`

The ID of the user to get. You can get this from `Astro.locals.dbUser.id` when StudioCMS Auth middleware is used.

## Returns

`Promise`\<[`UserResponse`](/typedoc/studiocms-core/utils/contenthelper/type-aliases/userresponse/)\>

The user data.

## Defined in

packages/studioCMS/src/utils/contentHelper.ts:167

---
editUrl: false
next: true
prev: true
title: getUserById
slug: 0.1.0-beta.5/typedoc/studiocms-core/helpers/contenthelper/functions/getuserbyid
---

> **getUserById**(`userId`): `Promise`\<[`UserResponse`](/0.1.0-beta.5/typedoc/studiocms-core/helpers/contenthelper/type-aliases/userresponse/)>

Get user by ID helper function to get a user by their ID from Astro Studio's Database.

## Parameters

• **userId**: `string`

The ID of the user to get. You can get this from `Astro.locals.dbUser.id` when StudioCMS Auth middleware is used.

## Returns

`Promise`\<[`UserResponse`](/0.1.0-beta.5/typedoc/studiocms-core/helpers/contenthelper/type-aliases/userresponse/)>

The user data.

## Defined in

[packages/studiocms\_core/src/helpers/contentHelper.ts:167](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/helpers/contentHelper.ts#L167)

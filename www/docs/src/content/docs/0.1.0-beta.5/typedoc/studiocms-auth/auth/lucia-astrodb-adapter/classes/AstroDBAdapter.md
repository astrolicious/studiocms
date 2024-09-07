---
editUrl: false
next: true
prev: true
title: AstroDBAdapter
slug: 0.1.0-beta.5/typedoc/studiocms-auth/auth/lucia-astrodb-adapter/classes/astrodbadapter
---

## Implements

* `Adapter`

## Constructors

### new AstroDBAdapter()

> **new AstroDBAdapter**(`db`, `sessionTable`, `userTable`): [`AstroDBAdapter`](/0.1.0-beta.5/typedoc/studiocms-auth/auth/lucia-astrodb-adapter/classes/astrodbadapter/)

#### Parameters

• **db**: `Database`

• **sessionTable**: [`SessionTable`](/0.1.0-beta.5/typedoc/studiocms-auth/auth/lucia-astrodb-adapter/type-aliases/sessiontable/)

• **userTable**: [`UserTable`](/0.1.0-beta.5/typedoc/studiocms-auth/auth/lucia-astrodb-adapter/type-aliases/usertable/)

#### Returns

[`AstroDBAdapter`](/0.1.0-beta.5/typedoc/studiocms-auth/auth/lucia-astrodb-adapter/classes/astrodbadapter/)

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:13](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L13)

## Methods

### deleteExpiredSessions()

> **deleteExpiredSessions**(): `Promise`\<`void`>

#### Returns

`Promise`\<`void`>

#### Implementation of

`Adapter.deleteExpiredSessions`

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:76](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L76)

***

### deleteSession()

> **deleteSession**(`sessionId`): `Promise`\<`void`>

#### Parameters

• **sessionId**: `string`

#### Returns

`Promise`\<`void`>

#### Implementation of

`Adapter.deleteSession`

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:19](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L19)

***

### deleteUserSessions()

> **deleteUserSessions**(`userId`): `Promise`\<`void`>

#### Parameters

• **userId**: `string`

#### Returns

`Promise`\<`void`>

#### Implementation of

`Adapter.deleteUserSessions`

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:23](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L23)

***

### getSessionAndUser()

> **getSessionAndUser**(`sessionId`): `Promise`\<\[`null` | `DatabaseSession`, `null` | `DatabaseUser`]>

#### Parameters

• **sessionId**: `string`

#### Returns

`Promise`\<\[`null` | `DatabaseSession`, `null` | `DatabaseUser`]>

#### Implementation of

`Adapter.getSessionAndUser`

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:27](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L27)

***

### getUserSessions()

> **getUserSessions**(`userId`): `Promise`\<`DatabaseSession`\[]>

#### Parameters

• **userId**: `string`

#### Returns

`Promise`\<`DatabaseSession`\[]>

#### Implementation of

`Adapter.getUserSessions`

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:43](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L43)

***

### setSession()

> **setSession**(`session`): `Promise`\<`void`>

#### Parameters

• **session**: `DatabaseSession`

#### Returns

`Promise`\<`void`>

#### Implementation of

`Adapter.setSession`

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:54](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L54)

***

### updateSessionExpiration()

> **updateSessionExpiration**(`sessionId`, `expiresAt`): `Promise`\<`void`>

#### Parameters

• **sessionId**: `string`

• **expiresAt**: `Date`

#### Returns

`Promise`\<`void`>

#### Implementation of

`Adapter.updateSessionExpiration`

#### Defined in

[packages/studiocms\_auth/src/auth/lucia-astrodb-adapter.ts:66](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_auth/src/auth/lucia-astrodb-adapter.ts#L66)

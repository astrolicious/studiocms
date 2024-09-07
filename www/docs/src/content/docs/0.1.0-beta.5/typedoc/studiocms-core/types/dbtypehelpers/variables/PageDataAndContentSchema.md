---
editUrl: false
next: true
prev: true
title: PageDataAndContentSchema
slug: 0.1.0-beta.5/typedoc/studiocms-core/types/dbtypehelpers/variables/pagedataandcontentschema
---

> `const` **PageDataAndContentSchema**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`>

Zod Schema for PageDataAndContent objects from Astro:DB

## Type declaration

### PageContent

> **PageContent**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`>

#### Type declaration

##### content

> **content**: `ZodNullable`\<`ZodString`>

##### contentId

> **contentId**: `ZodString`

##### contentLang

> **contentLang**: `ZodString`

##### id

> **id**: `ZodString`

### PageData

> **PageData**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`>

#### Type declaration

##### contentLang

> **contentLang**: `ZodNullable`\<`ZodString`>

##### description

> **description**: `ZodString`

##### heroImage

> **heroImage**: `ZodString`

##### id

> **id**: `ZodString`

##### package

> **package**: `ZodString`

##### publishedAt

> **publishedAt**: `ZodDate`

##### showOnNav

> **showOnNav**: `ZodBoolean`

##### slug

> **slug**: `ZodString`

##### title

> **title**: `ZodString`

##### updatedAt

> **updatedAt**: `ZodNullable`\<`ZodDate`>

### Permissions

> **Permissions**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`>

#### Type declaration

##### rank

> **rank**: `ZodString`

##### username

> **username**: `ZodString`

### SiteConfig

> **SiteConfig**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`>

#### Type declaration

##### description

> **description**: `ZodString`

##### id

> **id**: `ZodNumber`

##### title

> **title**: `ZodString`

### User

> **User**: `ZodObject`\<`object`, `"strip"`, `ZodTypeAny`, `object`, `object`>

#### Type declaration

##### auth0Id

> **auth0Id**: `ZodNullable`\<`ZodString`>

##### avatar

> **avatar**: `ZodNullable`\<`ZodString`>

##### createdAt

> **createdAt**: `ZodNullable`\<`ZodDate`>

##### discordId

> **discordId**: `ZodNullable`\<`ZodString`>

##### email

> **email**: `ZodNullable`\<`ZodString`>

##### githubId

> **githubId**: `ZodNullable`\<`ZodNumber`>

##### githubURL

> **githubURL**: `ZodNullable`\<`ZodString`>

##### googleId

> **googleId**: `ZodNullable`\<`ZodString`>

##### id

> **id**: `ZodString`

##### name

> **name**: `ZodString`

##### password

> **password**: `ZodNullable`\<`ZodString`>

##### updatedAt

> **updatedAt**: `ZodNullable`\<`ZodDate`>

##### url

> **url**: `ZodNullable`\<`ZodString`>

##### username

> **username**: `ZodString`

## Defined in

[packages/studiocms\_core/src/types/dbtypehelpers.ts:6](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/types/dbtypehelpers.ts#L6)

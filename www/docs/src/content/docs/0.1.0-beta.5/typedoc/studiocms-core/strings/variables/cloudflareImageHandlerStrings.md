---
editUrl: false
next: true
prev: true
title: cloudflareImageHandlerStrings
slug: 0.1.0-beta.5/typedoc/studiocms-core/strings/variables/cloudflareimagehandlerstrings
---

> `const` **cloudflareImageHandlerStrings**: `object`

## Type declaration

### CloudflareImageServiceDisabled

> **CloudflareImageServiceDisabled**: `string` = `'Cloudflare Image Service Disabled. Using Astro Built-in Image Service.'`

### CloudflareImageServiceEnabled

> **CloudflareImageServiceEnabled**: `string` = `'Cloudflare Image Service Enabled. Using Cloudflare Image Service.'`

### NoOp

> **NoOp**: `string` = `'Using No-Op(Passthrough) Image Service...'`

### Sharp

> **Sharp**: `string` = `'Using Sharp Image Service...'`

### Squoosh

> **Squoosh**: `string` = `'Using Squoosh Image Service...'`

### cdnPluginStrings

> **cdnPluginStrings**: `object`

### cdnPluginStrings.NoOp

> **NoOp**: `string` = `'Using No-Op Image Service as Fallback for Cloudinary CDN Plugin'`

### cdnPluginStrings.Sharp

> **Sharp**: `string` = `'Using Sharp Image Service as Fallback for Cloudinary CDN Plugin'`

### cdnPluginStrings.Squoosh

> **Squoosh**: `string` = `'Using Squoosh Image Service as Fallback for Cloudinary CDN Plugin'`

### unpicStrings

> **unpicStrings**: `object`

### unpicStrings.NoOp

> **NoOp**: `string` = `'Loading @unpic/astro Image Service for External Images with No-Op Fallback'`

### unpicStrings.default

> **default**: `string` = `'Loading @unpic/astro Image Service for External Images'`

### unpicStrings.disabled

> **disabled**: `string` = `'@unpic/astro Image Service Disabled, using Astro Built-in Image Service.'`

### unsupported

> **unsupported**: `object`

### unsupported.Sharp

> **Sharp**: `string` = `"Cloudflare SSR does not support Sharp Image Service. Using no-op Service as astroImageServiceConfig is set to 'sharp'"`

### unsupported.Squoosh

> **Squoosh**: `string` = `"Cloudflare SSR does not support Squoosh Image Service. Using no-op Service as astroImageServiceConfig is set to 'squoosh'"`

## Defined in

[packages/studiocms\_core/src/strings.ts:125](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/strings.ts#L125)

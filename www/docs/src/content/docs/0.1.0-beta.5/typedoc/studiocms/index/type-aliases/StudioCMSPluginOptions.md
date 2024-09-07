---
editUrl: false
next: true
prev: true
title: StudioCMSPluginOptions
slug: 0.1.0-beta.5/typedoc/studiocms/index/type-aliases/studiocmspluginoptions
---

> **StudioCMSPluginOptions**: `object`

## Type declaration

### opts

> **opts**: `object`

The options for the plugin

### opts.customRendererPluginPath?

> `optional` **customRendererPluginPath**: `string`

The custom renderer plugin path - This is used to replace the built-in Markdown renderer. Recommended for advanced users.

### opts.dashboardPageLinks?

> `optional` **dashboardPageLinks**: `DashboardPageLink`\[]

Custom dashboard pages for the plugin

### opts.navigationLinks?

> `optional` **navigationLinks**: `object`\[]

The front-end navigation links for the plugin

### opts.pluginLabel

> **pluginLabel**: `string`

The label for the plugin (used in the dashboard)

### pkgname

> **pkgname**: `string`

The package name of the plugin

## Defined in

[packages/studiocms\_core/src/types/pluginOptions.ts:16](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/types/pluginOptions.ts#L16)

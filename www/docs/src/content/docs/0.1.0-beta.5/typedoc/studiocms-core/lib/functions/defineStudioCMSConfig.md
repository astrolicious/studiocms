---
editUrl: false
next: true
prev: true
title: defineStudioCMSConfig
slug: 0.1.0-beta.5/typedoc/studiocms-core/lib/functions/definestudiocmsconfig
---

> **defineStudioCMSConfig**(`config`): `object`

A utility function to define the StudioCMS config object.
This function is used to define the optional StudioCMS
config object in the Astro project root. The expected file
name is `studiocms.config.mjs`. And it should be adjacent
to the Astro project's `astro.config.mjs` file.

StudioCMS will attempt to import this file and use the default
export as the StudioCMS config object authomatically if it exists.

Using this function is optional, but it can be useful for IDEs
to provide better intellisense and type checking.

## Parameters

• **config**

• **config.contentRenderer**: `"marked"` | `"astro"` | `"markdoc"` = `...`

The Markdown Content Renderer to use for rendering pages and posts

Marked is A markdown parser and compiler. Built for speed.

**See**

* https://marked.js.org/ for more info about marked.

Astro is the built-in Astro remark-markdown plugin.

* https://www.npmjs.com/package/@astrojs/markdown-remark

Markdoc is a powerful, flexible, Markdown-based authoring framework. Built by Stripe.

* https://markdoc.dev/ for more info about markdoc.

• **config.dashboardConfig** = `dashboardConfigSchema`

Allows customization of the Dashboard Configuration

Coming soon....

• **config.dashboardConfig.AuthConfig** = `authConfigSchema`

Auth Configuration - Allows customization of the Authentication Configuration

• **config.dashboardConfig.AuthConfig.enabled**: `boolean` = `...`

Auth Enabled - Allows enabling or disabling of the Authentication Configuration

**Default**

```ts
true
```

• **config.dashboardConfig.AuthConfig.providers** = `authProviderSchema`

Auth Providers - Allows enabling or disabling of the Authentication Providers

• **config.dashboardConfig.AuthConfig.providers.auth0**: `boolean` = `...`

Auth0 Auth Provider - Powered by Lucia

Requires an Auth0 Application to be created and configured using ENV Variables

**Default**

```ts
false
```

• **config.dashboardConfig.AuthConfig.providers.discord**: `boolean` = `...`

Discord Auth Provider - Powered by Lucia

Requires a Discord OAuth App to be created and configured using ENV Variables

**Default**

```ts
false
```

• **config.dashboardConfig.AuthConfig.providers.github**: `boolean` = `...`

GitHub Auth Provider - Powered by Lucia

Requires a GitHub OAuth App to be created and configured using ENV Variables

**Default**

```ts
true
```

• **config.dashboardConfig.AuthConfig.providers.google**: `boolean` = `...`

Google Auth Provider - Powered by Lucia

Requires a Google OAuth App to be created and configured using ENV Variables

**Default**

```ts
false
```

• **config.dashboardConfig.AuthConfig.providers.usernameAndPassword**: `boolean` = `...`

Username and Password Auth Provider - Powered by Lucia

• **config.dashboardConfig.AuthConfig.providers.usernameAndPasswordConfig** = `localUsernameAndPasswordConfig`

• **config.dashboardConfig.AuthConfig.providers.usernameAndPasswordConfig.allowUserRegistration**: `boolean` = `...`

Allow User Registration - Allows users to register an account

**Default**

```ts
false
```

• **config.dashboardConfig.UnoCSSConfigOverride** = `unocssConfigSchema`

UnoCSS Configuration - Allows customization of the UnoCSS Configuration

**Note: Use with caution, this is an advanced feature**

StudioCMS uses UnoCSS+DaisyUI to provide a TailwindCSS-like experience with minimal CSS+prebuilt theme options!. This configuration allows you to override the default configuration.

• **config.dashboardConfig.UnoCSSConfigOverride.injectEntry**: `boolean` = `...`

OPTIONAL - This allows the user to enable or disable the UnoCSS Default Entry import

If you would like to use our UnoCSS configuration with our front-end you can enable this option to import the default entry styles or use the example from the code snippet below to import the entry styles into your Base Layout/header.

```tsx
---
import 'uno.css';
---
```

**Default**

```ts
false
The default is false to prevent the dashboard from injecting the entry styles into your project.
```

• **config.dashboardConfig.UnoCSSConfigOverride.injectReset**: `boolean` = `...`

OPTIONAL - This allows the user to enable or disable the UnoCSS Default Reset import

If you would like to use our UnoCSS configuration with our front-end you can enable this option to import the default reset styles or use the example from the code snippet below to import the reset styles into your Base Layout/header.

```tsx
---
import '@unocss/reset/tailwind.css';
---
```

**Default**

```ts
false
The default is false to prevent the dashboard from injecting the reset styles into your project.
```

• **config.dashboardConfig.UnoCSSConfigOverride.presetsConfig** = `unocssPresetsSchema`

Allows the user to modify the included UnoCSS Presets

• **config.dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI** = `unocssDaisyUISchema`

OPTIONAL - This allows the user to enable or disable the UnoCSS DaisyUI Preset

• **config.dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI.darkTheme**: `string` = `...`

OPTIONAL - This allows the user to set the default dark theme

**Default**

```ts
'dark'
```

• **config.dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI.lightTheme**: `string` = `...`

OPTIONAL - This allows the user to set the default light theme

**Default**

```ts
'light'
```

• **config.dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI.themes**: `string`\[] = `...`

OPTIONAL - This allows the user to use any of the available DaisyUI themes

**Default**

```ts
['light', 'dark']
```

• **config.dashboardConfig.dashboardEnabled**: `boolean` = `...`

OPTIONAL - This allows the user to enable or disable the Astro Studio CMS Dashboard but still provide all the helper's and utilities to those who are customizing their setup, doing so will disable the dashboard and you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build

**Default**

```ts
true
```

• **config.dashboardConfig.dashboardRouteOverride?**: `string` = `...`

OPTIONAL - This allows the user to override the default dashboard route to a custom route

**Note: Use with caution, this is an advanced feature**

**Usage**

* The default route is `dashboard` without any `/` or `\` characters. If you want to override the route to `/admin` you would set this value to `admin`

**Default**

```ts
"dashboard"
```

• **config.dashboardConfig.developerConfig** = `developerConfigSchema`

Developer Options/Configuration

• **config.dashboardConfig.developerConfig.testingAndDemoMode**: `boolean` = `...`

Enable Testing and Demo Mode

This will enable the testing and demo mode for the Astro Studio CMS Dashboard, this will allow you to test the dashboard without having to authenticate. This is useful for testing and demo purposes as it will allow you to see how the dashboard works and looks but disable any changes to the database.

**Default**

```ts
false
```

• **config.dashboardConfig.developerConfig.viewTransitionAPI**: `boolean` = `...`

Zero-JavaScript View Transitions

Chrome 126 (released last week) and Microsoft Edge 126 (releasing this week) both support “cross-document view transitions” unlocking zero-JavaScript view transitions in Astro.

**See**

https://astro.build/blog/future-of-astro-zero-js-view-transitions/

• **config.dashboardConfig.faviconURL**: `string` = `...`

OPTIONAL - This allows the user to override the default Favicon URL to a custom URL

• **config.dateLocale**: `string` = `...`

Date Locale used for formatting dates

• **config.dbStartPage**: `boolean` = `...`

Project Initialization Page - Used during First Time Setup to initialize the database

**Default**

```ts
true
```

• **config.defaultFrontEndConfig** = `DefaultFrontEndConfigSchema`

Default Frontend Configuration

• **config.defaultFrontEndConfig.favicon**: `string` = `...`

Favicon Configuration - The default favicon configuration for the Frontend

• **config.defaultFrontEndConfig.htmlDefaultHead**: `object`\[] = `...`

HTML Default Header - The default head configuration for the Frontend

• **config.defaultFrontEndConfig.htmlDefaultLanguage**: `string` = `...`

HTML Default Language - The default language for the HTML tag

**Default**

```ts
'en'
```

• **config.defaultFrontEndConfig.inject404Route**: `boolean` = `...`

Inject 404 Route - Injects a 404 route for handling unknown routes

**Default**

```ts
true
```

• **config.defaultFrontEndConfig.injectDefaultFrontEndRoutes**: `boolean` = `...`

Inject Default Routes - Injects the default routes for the StudioCMS Frontend

**Default**

```ts
true
```

• **config.defaultFrontEndConfig.layoutOverride?**: `string` = `...`

Layout Override - The default layout override for the Frontend

• **config.imageService** = `imageServiceSchema`

Allows customization of the Image Service Options

• **config.imageService.astroImageServiceConfig**: `"sharp"` | `"no-op"` = `...`

If the user wants to disable the `@unpic/astro` image service, they can specify their desired Astro Built-in Image Service using this option.

Note: This option is only used if `useUnpic` is set to `false`

**Default**

```ts
"squoosh"
```

• **config.imageService.cdnPlugin?**: `"cloudinary-js"` = `...`

If the user wants to use a custom Supported CDN Plugin, they can specify it here.

Currently Supported CDN Plugins: **cloudinary-js**

Note: Enabling this option will disable the use of the `@unpic/astro` image service for external images. For local images and Fallback, the `astroImageServiceConfig` will be used.

• **config.imageService.unpicConfig** = `unpicConfigSchema`

OPTIONAL - Allows the user to customize the `@unpic/astro` image optimization service

• **config.imageService.unpicConfig.cdnOptions**: `CdnOptions` = `...`

CDN-specific options.

• **config.imageService.unpicConfig.fallbackService?**: `ImageCdn` | `"sharp"` | `"squoosh"` = `...`

The image service to use for local images and when the CDN can't be
determined from the image src. Value can be any supported image CDN,
or "sharp" or "squoosh" to use the local image service.
By default it will either use the local "squoosh" service, or will
try to detect available services based on the environment.
This detection currently works on Netlify and Vercel.

Falls back to the value of `astroImageServiceConfig` if not set here

• **config.imageService.unpicConfig.layout**: `"constrained"` | `"fixed"` | `"fullWidth"` = `...`

The default layout to use for images. Defaults to "constrained".

**See**

https://unpic.pics/img/learn/#layouts

**Default**

```ts
"constrained"
```

• **config.imageService.unpicConfig.placeholder**: `"blurhash"` | `"dominantColor"` | `"lqip"` = `...`

The default placeholder background to use for images.
Can be `"blurhash"`, `"dominantColor"`, or `"lqip"`
Local images don't support `"blurhash"`, `"dominantColor"` or `"lqip"`, and will
not include a background
Default is no background.
Note that because the element uses no Javascript, the background will not
be removed when the image loads, so you should not use it for images that
have transparency.

**See**

https://unpic.pics/placeholder

**Default**

```ts
"blurhash"
```

• **config.imageService.useUnpic**: `boolean` = `...`

OPTIONAL - Allows the user to enable/disable the use of the `@unpic/astro` image optimization service for external images

**Default**

```ts
true
```

• **config.includedIntegrations** = `includedIntegrationsSchema`

Allows enabling and disabling of the included integrations

• **config.includedIntegrations.astroRobotsConfig**: `RobotsConfig` = `...`

• **config.includedIntegrations.useAstroRobots**: `boolean` = `...`

Allows the user to enable/disable the use of the StudioCMS Custom `astro-robots-txt` Integration

**Default**

```ts
true
```

• **config.includedIntegrations.useInoxSitemap**: `boolean` = `...`

Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin
For more information on the Inox-tools Sitemap Plugin, visit:

**See**

https://inox-tools.vercel.app/sitemap-ext

# TEMPORARILY DISABLED

If you would like to still use the Inox-tools Sitemap Plugin, you can manually add it to your project's Integrations.

• **config.markedConfig** = `markedConfigSchema`

Allows customization of the Marked Configuration

Marked is a markdown parser and compiler. Built for speed. It is used to convert markdown strings into HTML for rendering content on StudioCMS pages.

**See**

https://marked.js.org/ for more info about marked.

• **config.markedConfig.highlighterConfig** = `markedHighlighterConfigSchema`

Allows the user to customize the current Marked Highlighter

• **config.markedConfig.highlighterConfig.highlighter**: `"shiki"` | `"disabled"` = `...`

Allows the user to choose between the `shiki` and Other eventually supported Highlighters

Note: The Shiki Highlighter is from the `astro` package.

**Default**

```ts
'disabled'
```

• **config.markedConfig.highlighterConfig.shikiConfig** = `shikiConfigSchema`

Allows the user to configure the Shiki Highlighter

• **config.markedConfig.highlighterConfig.shikiConfig.loadLangs?**: `LanguageInput`\[] = `...`

Allows the user to load additional Shiki Languages

Note: This option is only used if the user wants to load additional Shiki Languages

**Example**

```ts
loadLangs: [ import('shiki/languages/rust.mjs'), import('shiki/languages/scala.mjs') ]
```

• **config.markedConfig.highlighterConfig.shikiConfig.loadThemes?**: `ThemeInput`\[] = `...`

Allows the user to load additional Shiki Themes

Note: This option is only used if the user wants to load additional Shiki Themes

**Example**

```ts
loadThemes: [ import('shiki/themes/github-dark-default.mjs'), import('shiki/themes/night-owl.mjs') ]
```

• **config.markedConfig.highlighterConfig.shikiConfig.theme**: `BundledTheme` = `...`

Allows the user to choose a Shiki Theme.

Note: The Only available themes are the ones listed below, and the user can import them from the `shiki` package. using loadTheme option.

### Current Bundled Themes:

* `houston`
* `github-dark`
* `github-light`
* `night-owl`

Import the theme from the `shiki` package

**Default**

```ts
theme: "houston"
```

• **config.markedConfig.includedExtensions** = `markedExtensionsSchema`

Allows Enabling and Disabling of the included Marked Extensions

• **config.markedConfig.includedExtensions.markedAlert**: `boolean` = `...`

Allows the user to enable/disable the use of the `marked-alert` extension

**Default**

```ts
true
```

**See**

https://www.npmjs.com/package/marked-alert

• **config.markedConfig.includedExtensions.markedEmoji**: `boolean` = `...`

Allows the user to enable/disable the use of the `marked-emoji` extension

**Default**

```ts
true
```

**See**

https://www.npmjs.com/package/marked-emoji

• **config.markedConfig.includedExtensions.markedFootnote**: `boolean` = `...`

Allows the user to enable/disable the use of the `marked-footnote` extension

**Default**

```ts
true
```

**See**

https://www.npmjs.com/package/marked-footnote

• **config.markedConfig.includedExtensions.markedSmartypants**: `boolean` = `...`

Allows the user to enable/disable the use of the `marked-smartypants` extension

**Default**

```ts
true
```

**See**

https://www.npmjs.com/package/marked-smartypants

• **config.markedConfig.loadmarkedExtensions?**: `MarkedExtension`\[] = `...`

Allows the user to load additional Marked Extensions

Note: This option is only used if the user wants to load additional Marked Extensions

**See**

https://marked.js.org/using\_advanced#extensions for more info about Marked Extensions

**Example**

```ts
import markedAlert from "marked-alert";

loadmarkedExtensions: [ markedAlert() ]
```

• **config.overrides** = `overridesSchema`

Component Overrides - Allows for customizing the components used in StudioCMS

• **config.overrides.CustomImageOverride?**: `string` = `...`

Allows the user to override the default image component used in StudioCMS for rendering images.

• **config.overrides.FormattedDateOverride?**: `string` = `...`

Allows the user to override the default formatted date component used in StudioCMS for rendering dates.

• **config.verbose**: `boolean` = `...`

Whether to show verbose output

**Default**

```ts
false
```

## Returns

`object`

### contentRenderer

> **contentRenderer**: `"marked"` | `"astro"` | `"markdoc"`

The Markdown Content Renderer to use for rendering pages and posts

Marked is A markdown parser and compiler. Built for speed.

#### See

* https://marked.js.org/ for more info about marked.

Astro is the built-in Astro remark-markdown plugin.

* https://www.npmjs.com/package/@astrojs/markdown-remark

Markdoc is a powerful, flexible, Markdown-based authoring framework. Built by Stripe.

* https://markdoc.dev/ for more info about markdoc.

### dashboardConfig

> **dashboardConfig**: `object` = `dashboardConfigSchema`

Allows customization of the Dashboard Configuration

Coming soon....

### dashboardConfig.AuthConfig

> **AuthConfig**: `object` = `authConfigSchema`

Auth Configuration - Allows customization of the Authentication Configuration

### dashboardConfig.AuthConfig.enabled

> **enabled**: `boolean`

Auth Enabled - Allows enabling or disabling of the Authentication Configuration

#### Default

```ts
true
```

### dashboardConfig.AuthConfig.providers

> **providers**: `object` = `authProviderSchema`

Auth Providers - Allows enabling or disabling of the Authentication Providers

### dashboardConfig.AuthConfig.providers.auth0

> **auth0**: `boolean`

Auth0 Auth Provider - Powered by Lucia

Requires an Auth0 Application to be created and configured using ENV Variables

#### Default

```ts
false
```

### dashboardConfig.AuthConfig.providers.discord

> **discord**: `boolean`

Discord Auth Provider - Powered by Lucia

Requires a Discord OAuth App to be created and configured using ENV Variables

#### Default

```ts
false
```

### dashboardConfig.AuthConfig.providers.github

> **github**: `boolean`

GitHub Auth Provider - Powered by Lucia

Requires a GitHub OAuth App to be created and configured using ENV Variables

#### Default

```ts
true
```

### dashboardConfig.AuthConfig.providers.google

> **google**: `boolean`

Google Auth Provider - Powered by Lucia

Requires a Google OAuth App to be created and configured using ENV Variables

#### Default

```ts
false
```

### dashboardConfig.AuthConfig.providers.usernameAndPassword

> **usernameAndPassword**: `boolean`

Username and Password Auth Provider - Powered by Lucia

### dashboardConfig.AuthConfig.providers.usernameAndPasswordConfig

> **usernameAndPasswordConfig**: `object` = `localUsernameAndPasswordConfig`

### dashboardConfig.AuthConfig.providers.usernameAndPasswordConfig.allowUserRegistration

> **allowUserRegistration**: `boolean`

Allow User Registration - Allows users to register an account

#### Default

```ts
false
```

### dashboardConfig.UnoCSSConfigOverride

> **UnoCSSConfigOverride**: `object` = `unocssConfigSchema`

UnoCSS Configuration - Allows customization of the UnoCSS Configuration

**Note: Use with caution, this is an advanced feature**

StudioCMS uses UnoCSS+DaisyUI to provide a TailwindCSS-like experience with minimal CSS+prebuilt theme options!. This configuration allows you to override the default configuration.

### dashboardConfig.UnoCSSConfigOverride.injectEntry

> **injectEntry**: `boolean`

OPTIONAL - This allows the user to enable or disable the UnoCSS Default Entry import

If you would like to use our UnoCSS configuration with our front-end you can enable this option to import the default entry styles or use the example from the code snippet below to import the entry styles into your Base Layout/header.

```tsx
---
import 'uno.css';
---
```

#### Default

```ts
false
The default is false to prevent the dashboard from injecting the entry styles into your project.
```

### dashboardConfig.UnoCSSConfigOverride.injectReset

> **injectReset**: `boolean`

OPTIONAL - This allows the user to enable or disable the UnoCSS Default Reset import

If you would like to use our UnoCSS configuration with our front-end you can enable this option to import the default reset styles or use the example from the code snippet below to import the reset styles into your Base Layout/header.

```tsx
---
import '@unocss/reset/tailwind.css';
---
```

#### Default

```ts
false
The default is false to prevent the dashboard from injecting the reset styles into your project.
```

### dashboardConfig.UnoCSSConfigOverride.presetsConfig

> **presetsConfig**: `object` = `unocssPresetsSchema`

Allows the user to modify the included UnoCSS Presets

### dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI

> **presetDaisyUI**: `object` = `unocssDaisyUISchema`

OPTIONAL - This allows the user to enable or disable the UnoCSS DaisyUI Preset

### dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI.darkTheme

> **darkTheme**: `string`

OPTIONAL - This allows the user to set the default dark theme

#### Default

```ts
'dark'
```

### dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI.lightTheme

> **lightTheme**: `string`

OPTIONAL - This allows the user to set the default light theme

#### Default

```ts
'light'
```

### dashboardConfig.UnoCSSConfigOverride.presetsConfig.presetDaisyUI.themes

> **themes**: `string`\[]

OPTIONAL - This allows the user to use any of the available DaisyUI themes

#### Default

```ts
['light', 'dark']
```

### dashboardConfig.dashboardEnabled

> **dashboardEnabled**: `boolean`

OPTIONAL - This allows the user to enable or disable the Astro Studio CMS Dashboard but still provide all the helper's and utilities to those who are customizing their setup, doing so will disable the dashboard and you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build

#### Default

```ts
true
```

### dashboardConfig.dashboardRouteOverride?

> `optional` **dashboardRouteOverride**: `string`

OPTIONAL - This allows the user to override the default dashboard route to a custom route

**Note: Use with caution, this is an advanced feature**

#### Usage

* The default route is `dashboard` without any `/` or `\` characters. If you want to override the route to `/admin` you would set this value to `admin`

#### Default

```ts
"dashboard"
```

### dashboardConfig.developerConfig

> **developerConfig**: `object` = `developerConfigSchema`

Developer Options/Configuration

### dashboardConfig.developerConfig.testingAndDemoMode

> **testingAndDemoMode**: `boolean`

Enable Testing and Demo Mode

This will enable the testing and demo mode for the Astro Studio CMS Dashboard, this will allow you to test the dashboard without having to authenticate. This is useful for testing and demo purposes as it will allow you to see how the dashboard works and looks but disable any changes to the database.

#### Default

```ts
false
```

### dashboardConfig.developerConfig.viewTransitionAPI

> **viewTransitionAPI**: `boolean`

Zero-JavaScript View Transitions

Chrome 126 (released last week) and Microsoft Edge 126 (releasing this week) both support “cross-document view transitions” unlocking zero-JavaScript view transitions in Astro.

#### See

https://astro.build/blog/future-of-astro-zero-js-view-transitions/

### dashboardConfig.faviconURL

> **faviconURL**: `string`

OPTIONAL - This allows the user to override the default Favicon URL to a custom URL

### dateLocale

> **dateLocale**: `string`

Date Locale used for formatting dates

### dbStartPage

> **dbStartPage**: `boolean`

Project Initialization Page - Used during First Time Setup to initialize the database

#### Default

```ts
true
```

### defaultFrontEndConfig

> **defaultFrontEndConfig**: `object` = `DefaultFrontEndConfigSchema`

Default Frontend Configuration

### defaultFrontEndConfig.favicon

> **favicon**: `string`

Favicon Configuration - The default favicon configuration for the Frontend

### defaultFrontEndConfig.htmlDefaultHead

> **htmlDefaultHead**: `object`\[]

HTML Default Header - The default head configuration for the Frontend

### defaultFrontEndConfig.htmlDefaultLanguage

> **htmlDefaultLanguage**: `string`

HTML Default Language - The default language for the HTML tag

#### Default

```ts
'en'
```

### defaultFrontEndConfig.inject404Route

> **inject404Route**: `boolean`

Inject 404 Route - Injects a 404 route for handling unknown routes

#### Default

```ts
true
```

### defaultFrontEndConfig.injectDefaultFrontEndRoutes

> **injectDefaultFrontEndRoutes**: `boolean`

Inject Default Routes - Injects the default routes for the StudioCMS Frontend

#### Default

```ts
true
```

### defaultFrontEndConfig.layoutOverride?

> `optional` **layoutOverride**: `string`

Layout Override - The default layout override for the Frontend

### imageService

> **imageService**: `object` = `imageServiceSchema`

Allows customization of the Image Service Options

### imageService.astroImageServiceConfig

> **astroImageServiceConfig**: `"sharp"` | `"no-op"`

If the user wants to disable the `@unpic/astro` image service, they can specify their desired Astro Built-in Image Service using this option.

Note: This option is only used if `useUnpic` is set to `false`

#### Default

```ts
"squoosh"
```

### imageService.cdnPlugin?

> `optional` **cdnPlugin**: `"cloudinary-js"`

If the user wants to use a custom Supported CDN Plugin, they can specify it here.

Currently Supported CDN Plugins: **cloudinary-js**

Note: Enabling this option will disable the use of the `@unpic/astro` image service for external images. For local images and Fallback, the `astroImageServiceConfig` will be used.

### imageService.unpicConfig

> **unpicConfig**: `object` = `unpicConfigSchema`

OPTIONAL - Allows the user to customize the `@unpic/astro` image optimization service

### imageService.unpicConfig.cdnOptions

> **cdnOptions**: `CdnOptions`

CDN-specific options.

### imageService.unpicConfig.fallbackService?

> `optional` **fallbackService**: `ImageCdn` | `"sharp"` | `"squoosh"`

The image service to use for local images and when the CDN can't be
determined from the image src. Value can be any supported image CDN,
or "sharp" or "squoosh" to use the local image service.
By default it will either use the local "squoosh" service, or will
try to detect available services based on the environment.
This detection currently works on Netlify and Vercel.

Falls back to the value of `astroImageServiceConfig` if not set here

### imageService.unpicConfig.layout

> **layout**: `"constrained"` | `"fixed"` | `"fullWidth"`

The default layout to use for images. Defaults to "constrained".

#### See

https://unpic.pics/img/learn/#layouts

#### Default

```ts
"constrained"
```

### imageService.unpicConfig.placeholder

> **placeholder**: `"blurhash"` | `"dominantColor"` | `"lqip"`

The default placeholder background to use for images.
Can be `"blurhash"`, `"dominantColor"`, or `"lqip"`
Local images don't support `"blurhash"`, `"dominantColor"` or `"lqip"`, and will
not include a background
Default is no background.
Note that because the element uses no Javascript, the background will not
be removed when the image loads, so you should not use it for images that
have transparency.

#### See

https://unpic.pics/placeholder

#### Default

```ts
"blurhash"
```

### imageService.useUnpic

> **useUnpic**: `boolean`

OPTIONAL - Allows the user to enable/disable the use of the `@unpic/astro` image optimization service for external images

#### Default

```ts
true
```

### includedIntegrations

> **includedIntegrations**: `object` = `includedIntegrationsSchema`

Allows enabling and disabling of the included integrations

### includedIntegrations.astroRobotsConfig

> **astroRobotsConfig**: `RobotsConfig`

### includedIntegrations.useAstroRobots

> **useAstroRobots**: `boolean`

Allows the user to enable/disable the use of the StudioCMS Custom `astro-robots-txt` Integration

#### Default

```ts
true
```

### includedIntegrations.useInoxSitemap

> **useInoxSitemap**: `boolean`

Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin
For more information on the Inox-tools Sitemap Plugin, visit:

#### See

https://inox-tools.vercel.app/sitemap-ext

# TEMPORARILY DISABLED

If you would like to still use the Inox-tools Sitemap Plugin, you can manually add it to your project's Integrations.

### markedConfig

> **markedConfig**: `object` = `markedConfigSchema`

Allows customization of the Marked Configuration

Marked is a markdown parser and compiler. Built for speed. It is used to convert markdown strings into HTML for rendering content on StudioCMS pages.

#### See

https://marked.js.org/ for more info about marked.

### markedConfig.highlighterConfig

> **highlighterConfig**: `object` = `markedHighlighterConfigSchema`

Allows the user to customize the current Marked Highlighter

### markedConfig.highlighterConfig.highlighter

> **highlighter**: `"shiki"` | `"disabled"`

Allows the user to choose between the `shiki` and Other eventually supported Highlighters

Note: The Shiki Highlighter is from the `astro` package.

#### Default

```ts
'disabled'
```

### markedConfig.highlighterConfig.shikiConfig

> **shikiConfig**: `object` = `shikiConfigSchema`

Allows the user to configure the Shiki Highlighter

### markedConfig.highlighterConfig.shikiConfig.loadLangs?

> `optional` **loadLangs**: `LanguageInput`\[]

Allows the user to load additional Shiki Languages

Note: This option is only used if the user wants to load additional Shiki Languages

#### Example

```ts
loadLangs: [ import('shiki/languages/rust.mjs'), import('shiki/languages/scala.mjs') ]
```

### markedConfig.highlighterConfig.shikiConfig.loadThemes?

> `optional` **loadThemes**: `ThemeInput`\[]

Allows the user to load additional Shiki Themes

Note: This option is only used if the user wants to load additional Shiki Themes

#### Example

```ts
loadThemes: [ import('shiki/themes/github-dark-default.mjs'), import('shiki/themes/night-owl.mjs') ]
```

### markedConfig.highlighterConfig.shikiConfig.theme

> **theme**: `BundledTheme`

Allows the user to choose a Shiki Theme.

Note: The Only available themes are the ones listed below, and the user can import them from the `shiki` package. using loadTheme option.

### Current Bundled Themes:

* `houston`
* `github-dark`
* `github-light`
* `night-owl`

Import the theme from the `shiki` package

#### Default

```ts
theme: "houston"
```

### markedConfig.includedExtensions

> **includedExtensions**: `object` = `markedExtensionsSchema`

Allows Enabling and Disabling of the included Marked Extensions

### markedConfig.includedExtensions.markedAlert

> **markedAlert**: `boolean`

Allows the user to enable/disable the use of the `marked-alert` extension

#### Default

```ts
true
```

#### See

https://www.npmjs.com/package/marked-alert

### markedConfig.includedExtensions.markedEmoji

> **markedEmoji**: `boolean`

Allows the user to enable/disable the use of the `marked-emoji` extension

#### Default

```ts
true
```

#### See

https://www.npmjs.com/package/marked-emoji

### markedConfig.includedExtensions.markedFootnote

> **markedFootnote**: `boolean`

Allows the user to enable/disable the use of the `marked-footnote` extension

#### Default

```ts
true
```

#### See

https://www.npmjs.com/package/marked-footnote

### markedConfig.includedExtensions.markedSmartypants

> **markedSmartypants**: `boolean`

Allows the user to enable/disable the use of the `marked-smartypants` extension

#### Default

```ts
true
```

#### See

https://www.npmjs.com/package/marked-smartypants

### markedConfig.loadmarkedExtensions?

> `optional` **loadmarkedExtensions**: `MarkedExtension`\[]

Allows the user to load additional Marked Extensions

Note: This option is only used if the user wants to load additional Marked Extensions

#### See

https://marked.js.org/using\_advanced#extensions for more info about Marked Extensions

#### Example

```ts
import markedAlert from "marked-alert";

loadmarkedExtensions: [ markedAlert() ]
```

### overrides

> **overrides**: `object` = `overridesSchema`

Component Overrides - Allows for customizing the components used in StudioCMS

### overrides.CustomImageOverride?

> `optional` **CustomImageOverride**: `string`

Allows the user to override the default image component used in StudioCMS for rendering images.

### overrides.FormattedDateOverride?

> `optional` **FormattedDateOverride**: `string`

Allows the user to override the default formatted date component used in StudioCMS for rendering dates.

### verbose

> **verbose**: `boolean`

Whether to show verbose output

#### Default

```ts
false
```

## Example

```js
// studiocms.config.mjs
import { defineStudioCMSConfig } from '@astrolicious/studiocms';

export default defineStudioCMSConfig({
 dbStartPage: true,
 contentRenderer: 'marked',
 verbose: true,
 dateLocale: 'en-us',
 // ...Other Options
})
```

## Defined in

[packages/studiocms\_core/src/lib/defineStudioCMSConfig.ts:31](https://github.com/astrolicious/studiocms/tree/main/packages/studiocms_core/src/lib/defineStudioCMSConfig.ts#L31)

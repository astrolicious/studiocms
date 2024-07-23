---
title: dashboard
description: A reference page for dashboard
---

`dashboard` option let's customize the dashboard for the `astroStudioCMS`. This is used to setup your dashboard data.

## Usage

```js title="astro.config.mjs"  {2-24}
astroStudioCMS({
  dashboard: {
    dashboardEnabled: true,
    faviconURL: "/favicon.ico",
    dashboardRouteOverride: "/components/dashboard",
    AuthConfig: {
        providers: {
            github: true,
            usernameAndPassword: true
        },
        enabled: true
    },
    UnoCSSConfigOverride: {
        injectReset: true,
        injectEntry: true,
        presetsConfig: {
            presetDaisyUI: {
                themes: ['dark', 'light'],
                lightTheme: ['light'],
                darkTheme: ['dark'],
            }
        }
    }
  }, // DEFAULT - This injects a dashboard to setup your dashboard data.
})
```

### `dashboardEnabled`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows the user to enable or disable the Astro StudioCMS dashboard but still provide all the helper's and utilities to those who are customizing their setup, doing so will disable the dashboard and you will need to manage your content via the Astro Studio Dashboard at [Astro Studio](http://studio.astro.build).


### `faviconURL`

- **Type:** `string | undefined`
- **Default:** `'/favicon.ico'`

Allows the user to override the default Favicon URL to a custom URL.

### `dashboardRouteOverride`

- **Type:** `string | undefined`

Allows the user to override the default dashboard route to a custom route.

### `AuthConfig`

- **Type:** `AuthConfigSchema{} | undefined{}`
- **Default:** `undefined{}`

Allows customization of the Authentication Configuration.

#### `providers`

- **Type:** `authProviderSchema{} | undefined{}`

Allows enabling or disabling of the Authentication Providers.

##### `github`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows enabling or disabling of the Github Authentication Provider.

##### `usernameAndPassword`

- **Type:** `boolean | undefined`
- **Default:** `false`

Allows enabling or disabling of the Username and Password Authentication Provider.

#### `enabled`

- **Type:** `boolean | undefined`
- **Default:** `true`

Allows enabling or disabling of the Authentication Configuration.

### `UnoCSSConfigOverride`

- **Type:** `unocssConfigSchema{} | undefined{}`

Allows customization of the UnoCSS Configuration.

#### `injectReset`

- **Type:** `boolean | undefined`
- **Default:** `false`

Allows the user to enable or disable the UnoCSS Default Reset import.

#### `injectEntry`

- **Type:** `boolean | undefined`
- **Default:** `false`

Allows the user to enable or disable the UnoCSS Default Entry import.

#### `presetsConfig`

- **Type:** `unocssPresetsSchema{} | undefined{}`

Allows the user to modify the included UnoCSS Presets.

##### `presetDaisyUI`

- **Type:** `unocssDaisyUISchema{} | undefined{}`

Allows the user to enable or disable the UnoCSS DaisyUI Preset.

###### `themes`

- **Type:** `Array<string> | undefined`
- **Default:** `['dark', 'light']`

Allows the user to use any of the available DaisyUI themes.

###### `lightTheme`

- **Type:** `string | undefined`
- **Default:** `'light'`

Allows the user to set the default light theme.

###### `darkTheme`

- **Type:** `string | undefined`
- **Default:** `'dark'`

Allows the user to set the default dark theme.

### `developerConfig`

- **Type:** `developerConfigSchema{} | undefined{}`

Developer Options/Configuration.

#### `viewTransitionsAPI`

- **Type:** `boolean | undefined`
- **Default:** `false`

Allows the user to enable Astro's ZeroJS View Transition API for the Astro Studio CMS Dashboard.

#### `testingAndDemoMode`

- **Type:** `boolean | undefined`
- **Default:** `false`

Enables Testing and Demo Mode

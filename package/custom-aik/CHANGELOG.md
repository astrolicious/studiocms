# astro-integration-kit

## 0.7.0

### Minor Changes

- 236bfbe: Introduces a build step internally that fixes a few types issues for integrations authors. This _should_ be non-breaking
- 2cd6d63: Updates how `defineIntegration`'s `options` are handled (breaking change). They're not optional by default, you need to manually add `.optional()` at the end of your zod schema. If it's optional, users can still pass nothing or `undefined`.
- 236bfbe: Simplifies plugins generics, allowing simpler plugin builds. This should be non-breaking for plugin relying on type inference, plugins with explicitly declared signature should update the following:

  ```diff
  type SomePlugin = Plugin<
    "utilityName",
    "astro:config:setup",
  -  (p: HookParams) => (params: UtilityParams) => UtilityOutput
  +  (params: UtilityParams) => UtilityOutput
  >;

  export const somePlugin: SomePlugin = definePlugin();
  ```

### Patch Changes

- 0499791: Add support for Astro DB hooks. See [docs](https://astro-integration-kit.netlify.app/core/define-integration/#astro-db-astrojsdb).

## 0.6.1

### Patch Changes

- d73c9e0: Updates `addVitePlugin` plugin type from `Plugin` to `PluginOption` to align with vite's configuration.

## 0.6.0

### Minor Changes

- c2f01fb: Adds a new `hasVitePlugin` utility. Other utilities have been updated to use it under the hood and warn when duplicate Vite plugins are created
- fc64f03: Allows passing imports as an array to `addVirtualImports` for more advanced use cases (eg. for different versions on server and client). This is a breaking change when using it as a utility as it now requires a new `config` prop

## 0.5.1

### Patch Changes

- c9f8870: Updates `addDts` to prettify the content automatically

## 0.5.0

### Minor Changes

- 3fc73d0: Updates `addVirtualImport` to `addVirtualImports` with the ability to resolve multiple imports using a single Vite plugin

## 0.4.0

### Minor Changes

- 2863031: Adds 2 new utilities, `addIntegration` as well as `addDevToolbarFrameworkApp` that allows you to build Dev Toolbar Apps using UI framework components!

### Patch Changes

- c445660: Updates the `optionsSchema` constraint to allow any schema shape

## 0.3.1

### Patch Changes

- 9835e32: Fixes issues reported by `tsc --noEmit` in users projects

## 0.3.0

### Minor Changes

- 8369363: Adds a new utility, `injectDevRoute`

## 0.2.1

### Patch Changes

- b3a72c0: Improves error messages for `optionsSchema` parsing

## 0.2.0

### Minor Changes

- f36fead: Removes `defineOptions` and replaces the `options` argument with a new `optionsSchema` argument on `defineIntegration`

  Check out the [migration guide](https://astro-integration-kit.netlify.app/core/define-options/).

## 0.1.2

### Patch Changes

- 79200b4: Prevents virtual imports name from starting with "astro:" (reserved for Astro core)

## 0.1.1

### Patch Changes

- a3e5230: Fixes type definition for integration setup `options`

## 0.1.0

### Minor Changes

- f05c7ab: Introduces plugins and improves documentation

## 0.0.12

### Patch Changes

- ea175b0: Fixes impossible types related to `defineIntegration` options

## 0.0.11

### Patch Changes

- 08e73d9: Updates imports from `node:path` to `pathe`

## 0.0.10

### Patch Changes

- 7a50397: Updates the `hasIntegration` utility to support relative position check

  When using extended hooks, the `hasIntegration` now accepts two optional arguments, one for relative position and one for a reference to the relative position.
  Those fields allow checking for the presence of an integration positioned before or after another in the Astro Config:

  ```ts
  // Check if Tailwind is installed before the current integration
  hasIntegration("@astrojs/tailwind", "before");

  // Check if Tailwind is installed after the current integration
  hasIntegration("@astrojs/tailwind", "after");

  // Check if Tailwind is installed before the MDX integration
  hasIntegration("@astrojs/tailwind", "before", "@astrojs/mdx");

  // Check if Tailwind is installed after the MDX integration
  hasIntegration("@astrojs/tailwind", "after", "@astrojs/mdx");
  ```

  When using standalone utilities, the `hasIntegration` utility now accept two optional fields:

  - `position` to enable checking the relative position of the integration.
  - `relativeTo` the integration to compare agains when checking for relative position.

  Since standalone utilities don't have the context of the current integration, checking for a relative position must include a `relativeTo`, throwing an error if one is not passed in.

  ```ts
  // Check if Tailwind is installed before the MDX integration
  hasIntegration({
    name: "@astrojs/tailwind",
    position: "before",
    relativeTo: "@astrojs/mdx",
    config: config,
  });

  // Check if Tailwind is installed after the MDX integration
  hasIntegration({
    name: "@astrojs/tailwind",
    position: "after",
    relativeTo: "@astrojs/mdx",
    config: config,
  });

  // Rejected by TypeScript and throws at runtime
  hasIntegration({
    name: "@astrojs/tailwind",
    position: "before",
    config: config,
  });
  ```

  If `position` is `undefined` or absent the utility will only check whether the integration is installed as it was before.

## 0.0.9

### Patch Changes

- 3276ecc: Adds the `addDts` utility
- d1b5cd3: Makes `defineIntegration` option `defaults` optional

## 0.0.8

### Patch Changes

- 9b3c1e2: Simplifies usage by providing additional utilities through extended hooks

## 0.0.7

### Patch Changes

- 97de1ae: Adds the `hasIntegration` utility
- 1ff8675: Improves JSDoc annotations

## 0.0.6

### Patch Changes

- f34c2e7: Makes `watchIntegration` synchronous
- 7b5ee7c: Adds a `addVitePlugin` utility
- eaa2122: Improves `defineIntegration` API

## 0.0.5

### Patch Changes

- ce17a1e: Adds the `defineIntegration` utility and all-in/vanilla modes

## 0.0.4

### Patch Changes

- 78a793e: Adds `addVirtualImport` utility

## 0.0.3

### Patch Changes

- 7ce3b82: Improves imports

## 0.0.2

### Patch Changes

- 40add83: Adds `watchIntegration` utility

## 0.0.1

### Patch Changes

- c381925: add createResolver

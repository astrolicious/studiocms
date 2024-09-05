# @astrolicious/studiocms

## 0.1.0-beta.5

### Patch Changes

- 0bd2b31: [Refactor/Rename]: Split main package into smaller packages and rename main package.

  This change will allow a better divide between the StudioCMS ecosystem packages. The main Astro Integration is now named `studiocms`.

  Renamed Packages:

  - `studiocms`: The main package that users will download and use.
  - `@studiocms/blog`: The StudioCMSBlog Plugin

  New Packages and their purposes:

  - `@studiocms/core`: Core components and functions
  - `@studiocms/assets`: Assets used for the StudioCMS Dashboard and other integrations
  - `@studiocms/renderers`: StudioCMS renderer system
  - `@studiocms/imagehandler`: StudioCMS image service and components
  - `@studiocms/auth`: StudioCMS auth routes and middleware
  - `@studiocms/frontend`: Userfacing pages and routes
  - `@studiocms/dashboard`: The main dashboard components, routes, and API endpoints
  - `@studiocms/robotstxt`: Generation of robots.txt file
  - `@studiocms/betaresources`: Resources for the beta.

- 0bd2b31: [Breaking]: Update AstroDB Table Schemas to use prefixed table names (i.e. `Permissions` -> `StudioCMSPermissions` )

  This change will require migration to a new database or a full wipe of the current database.

  It is recommended to link to a new database and push the new schema changes and migrate your data from the old one.

- Updated dependencies [0bd2b31]
  - @studiocms/robotstxt@0.1.0-beta.5

## 0.1.0-beta.4

### Patch Changes

- f1f64a3: Implement extension system for Plugins to include new dashboard pages right in the sidebar
- b2ddf03: Refactor Authhelper (no end user changes needed)
- ceccec5: [Fix]: Ensure `@astrojs/web-vitals` integration is an optional addon and not required.
- 56ef990: # Breaking Changes

  - [Breaking]: Astro 4.14.5 is now the lowest supported version of StudioCMS
  - [Breaking]: AstroDB 0.13.2 is now the lowest supported version of StudioCMS

  # Non-Breaking Changes

  - [Update]: Utilize new InjectTypes from Astro instead of addDts from AIK (No user changes needed)
  - [Update]: `@matthiesenxyz/integration-utils` updated to newest version and fix usage (No user changes needed)
  - [Refactor]: Move web-vitals child components into their own folder (No user changes needed)
  - [Refactor]: Update [`isDashboardRoute.ts`](https://github.com/astrolicious/studiocms/blob/main/packages/studioCMS/src/integrations/studioCMSDashboard/routes/dashboard/components/isDashboardRoute.ts) to use `.include()` instead of direct comparison (No user changes needed)
  - [Refactor]: Move to namespacebuiltins vite plugin(Astro Integration) included from `@matthiesenxyz/integration-utils` instead of the internal copy (No user changes needed)
  - [Fix]: Remove now not needed exclude rules for `@matthiesenxyz/integration-utils` (No user changes needed)

## 0.1.0-beta.3

### Patch Changes

- 0949b48: New Mailing system for Beta Feedback form
- 5679b08: Fix: Allow studiocms-auth.config.json to be created during first time database setup
- 9a137b5: [Bug]: Fix case sensitivity issue in authHelper function

## 0.1.0-beta.2

### Patch Changes

- a2edb83: Validate secrets (or not) for `astro:env`
- d29bda7: Add check for unsafe usernames or passwords when creating local username/password accounts
- a016f48: - StudioCMS-Dashboard:

  Update UnoCSS to `0.61.5` and DaisyUI Preset to `0.1.1`

- a82114f: Lint project code
- c93ef7b: Sidebar signout for guest users

## 0.1.0-beta.1

### Minor Changes

- Initial beta release

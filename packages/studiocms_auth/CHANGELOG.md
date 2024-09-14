# @studiocms/auth

## 0.1.0-beta.6

### Patch Changes

- 12bed03: [Code Scanning Fix] Polynomial regular expression used on uncontrolled data

  - Replace function used for leading and trailing slashes (Non-Breaking)

- Updated dependencies [12bed03]
- Updated dependencies [12bed03]
- Updated dependencies [1383e80]
- Updated dependencies [12bed03]
- Updated dependencies [12bed03]
- Updated dependencies [4f8e60b]
- Updated dependencies [12bed03]
  - @studiocms/dashboard@0.1.0-beta.6
  - @studiocms/assets@0.1.0-beta.6
  - @studiocms/core@0.1.0-beta.6

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

- Updated dependencies [0bd2b31]
- Updated dependencies [0bd2b31]
  - @studiocms/dashboard@0.1.0-beta.5
  - @studiocms/assets@0.1.0-beta.5
  - @studiocms/core@0.1.0-beta.5

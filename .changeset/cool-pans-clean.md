---
"@studiocms/betaresources": patch
"@studiocms/imagehandler": patch
"@studiocms/dashboard": patch
"@studiocms/renderers": patch
"@studiocms/robotstxt": patch
"@studiocms/frontend": patch
"@studiocms/assets": patch
"@studiocms/auth": patch
"@studiocms/blog": patch
"@studiocms/core": patch
"studiocms": patch
---

[Refactor/Rename]: Split main package into smaller packages and rename main package.

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
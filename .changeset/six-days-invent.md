---
"@astrolicious/studiocms": patch
---

# Breaking Changes

- [Breaking]: Astro 4.14.5 is now the lowest supported version of StudioCMS
- [Breaking]: AstroDB 0.13.2 is now the lowest supported version of StudioCMS

# Non-Breaking Changes

- [Update]: Utilize new InjectTypes from Astro instead of addDts from AIK (No user changes needed)
- [Update]: `@matthiesenxyz/integration-utils` updated to newest version and fix usage (No user changes needed)
- [Refactor]: Move web-vitals child components into their own folder (No user changes needed)
- [Refactor]: Update [`isDashboardRoute.ts`](https://github.com/astrolicious/studiocms/blob/main/packages/studioCMS/src/integrations/studioCMSDashboard/routes/dashboard/components/isDashboardRoute.ts) to use `.include()` instead of direct comparison (No user changes needed)
- [Refactor]: Move to namespacebuiltins vite plugin(Astro Integration) included from `@matthiesenxyz/integration-utils` instead of the internal copy (No user changes needed)
- [Fix]: Remove now not needed exclude rules for `@matthiesenxyz/integration-utils` (No user changes needed)
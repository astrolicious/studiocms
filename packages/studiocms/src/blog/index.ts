import studioCMSBlog from '@studiocms/blog';

/**
 * # StudioCMS Blog Theme(Integration)
 * *Note: To use this export, you must have `@studiocms/blog` installed in your project dependencies.*
 * #### Powered by [`astro-theme-provider`](https://github.com/astrolicious/astro-theme-provider) by [Bryce Russell](https://github.com/BryceRussell)
 *
 * This theme provides a Blog Index Page and RSS Feed for your StudioCMS Site as well as route handling for Blog Posts.
 *
 * @example
 * import { defineConfig } from 'astro/config';
 * import db from '@astrojs/db';
 * import studioCMS from 'studiocms';
 * import studioCMSBlog from 'studiocms/blog';
 *
 * // https://astro.build/config
 * export default defineConfig({
 *   site: "https://example.com",
 *   output: "server",
 *   adapter: ...
 *   integrations: [
 *     db(), // REQUIRED - `@astrojs/db` must be included in the integrations list
 *     studioCMS(), // REQUIRED - StudioCMS must be included in the integrations list
 *     studioCMSBlog({
 *       config: {
 *         title: "My StudioCMS Blog",
 *         description: "A Simple Blog build with Astro, Astrojs/DB, and StudioCMS.".
 *       },
 *     }),
 *   ],
 * });
 */
const integration = studioCMSBlog;

export default integration;

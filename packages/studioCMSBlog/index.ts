import defineTheme from "astro-theme-provider";
import { defineStudioCMSPlugin } from "@astrolicious/studiocms";
import { studioCMSBlogSchema } from "./schema";

const studioCMSBlogTheme = defineTheme({
	name: "studiocms-blog",
	schema: studioCMSBlogSchema,
});

export type ATP_ThemeOptions = Parameters<typeof studioCMSBlogTheme>[0];

/**
 * # StudioCMS Blog Theme(Integration) 
 * #### Powered by [`astro-theme-provider`](https://github.com/astrolicious/astro-theme-provider) by [Bryce Russell](https://github.com/BryceRussell)
 * 
 * This theme provides a Blog Index Page and RSS Feed for your StudioCMS Site as well as route handling for Blog Posts.
 * 
 * @example
 * import { defineConfig } from 'astro/config';
 * import db from '@astrojs/db';
 * import studioCMS from '@astrolicious/studiocms';
 * import studioCMSBlog from '@astrolicious/studiocms-blog';
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
export function studioCMSBlog(options: ATP_ThemeOptions) {
	let slug: string;

	if (typeof options?.pages?.["/blog"] === "string") {
		slug = options.pages["/blog"];
	} else {
		slug = "blog/";
	}

	defineStudioCMSPlugin({
		pkgname: "@astrolicious/studiocms-blog",
		opts: {
			pluginLabel: "StudioCMS Blog",
			navigationLinks: [ { text: "Blog", slug: slug } ]
		}
	});

	return studioCMSBlogTheme(options);
};

export default studioCMSBlog;
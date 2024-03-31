import { defineConfig } from "astro/config";
import astroStudioCMS from "@astrolicious/studiocms";
import db from '@astrojs/db';
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-studiocms.pages.dev',
	output: "server",
	adapter: cloudflare({
		imageService: "passthrough",
		// routes: {
		// 	extend: {
		//      // This route does not work, even though it should... i tried to add this but it does not work
		// 		include: [{ pattern: "/dashboard/*"}],
		// 	},
		// },
		platformProxy: {
		  enabled: true,
		},
	  }),
	integrations: [
		db(),
		astroStudioCMS({
			dbStartPage: false,
			markedConfig: {
				shikiConfig: {
					enabled: false
				},
			},
			authConfig: {
				mode: "disable",
			},
			verbose: true,
		}),
	],
});

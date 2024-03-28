import { defineConfig } from "astro/config";
import astroStudioCMS from "@astrolicious/studiocms";
import db from '@astrojs/db';
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
	site: 'http://localhost:4321',
	output: "server",
	adapter: cloudflare({
		platformProxy: {
		  enabled: true,
		},
	  }),
	integrations: [
		db(),
		astroStudioCMS({
			dbStartPage: false,
			verbose: true,
		}),
	],
});

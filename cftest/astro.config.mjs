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
		routes: {
			extend: {
				include: [{ pattern: "/dashboard/*"}],
			},
		},
		platformProxy: {
		  enabled: true,
		},
	  }),
	integrations: [
		db(),
		astroStudioCMS({
			dbStartPage: false,
			authConfig: {
				mode: "build-in"
			},
			verbose: true,
		}),
	],
});

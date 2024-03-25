import { defineConfig } from "astro/config";
import astroStudioCMS from "@astrolicious/studiocms";
import db from '@astrojs/db';
import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	output: "server",
	adapter: node({ mode: "standalone" }),
	integrations: [
		db(),
		astroStudioCMS({
			dbStartPage: false,
			verbose: true,
		}),
	],
});

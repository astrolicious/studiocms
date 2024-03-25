import { defineConfig } from "astro/config";
import astroStudioCMS from "@nametbd/astro-studio-cms";
import db from '@astrojs/db';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	output: "server",
	adapter: vercel(),
	integrations: [
		db(),
		astroStudioCMS({
			dbStartPage: false,
			verbose: true,
		}),
	],
});

import db from '@astrojs/db';
// import node from '@astrojs/node';
import astroStudioCMS from '@astrolicious/studiocms';
import { defineConfig } from 'astro/config';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
	site: 'https://ikc4k48.astro-studiocms.xyz',
	output: 'server',
	adapter: vercel(),
	integrations: [
		db(),
		astroStudioCMS({
			dbStartPage: false,
			contentRenderer: 'marked',
			verbose: true,
		}),
	],
});

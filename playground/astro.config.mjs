import db from '@astrojs/db';
import node from '@astrojs/node';
import astroStudioCMS from '@astrolicious/studiocms';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://wkcg0sk.astro-studiocms.xyz/',
	output: 'server',
	adapter: node({ mode: "standalone" }),
	integrations: [
		db(),
		astroStudioCMS({
			dbStartPage: false,
			contentRenderer: 'marked',
			verbose: true,
		}),
	],
});

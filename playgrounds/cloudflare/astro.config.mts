import cloudflare from '@astrojs/cloudflare';
import db from '@astrojs/db';
import { defineConfig } from 'astro/config';
// import studioCMS from 'studiocms';

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-studiocms.pages.dev',
	output: 'server',
	adapter: cloudflare({
		imageService: 'passthrough',
		platformProxy: {
			enabled: true,
		},
	}),
	integrations: [
		db(),
		// studioCMS({
		// 	dbStartPage: false,
		// 	authConfig: {
		// 		mode: 'disable',
		// 	},
		// 	verbose: true,
		// }),
	],
});

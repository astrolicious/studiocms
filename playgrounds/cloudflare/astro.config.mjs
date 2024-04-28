import cloudflare from '@astrojs/cloudflare';
import db from '@astrojs/db';
import studioCMS from '@astrolicious/studiocms';
import { defineConfig } from 'astro/config';

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
		studioCMS({
			dbStartPage: false,
			markedConfig: {
				highlighterConfig: {
					highlighter: 'highlightJs',
				},
			},
			authConfig: {
				mode: 'disable',
			},
			verbose: true,
		}),
	],
});

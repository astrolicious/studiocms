import db from '@astrojs/db';
import node from '@astrojs/node';
import studioCMS from '@astrolicious/studiocms';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://demo.astro-studiocms.xyz/',
	output: 'server',
	adapter: node({ mode: "standalone" }),
	integrations: [
		db(),
		studioCMS({
			dbStartPage: false,
			contentRenderer: 'marked',
			markedConfig: {
				highlighterConfig: {
					highlighter: 'disabled',
				},
			},
			verbose: true,
		}),
	],
});

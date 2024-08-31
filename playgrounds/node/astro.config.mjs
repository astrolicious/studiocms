import db from '@astrojs/db';
import node from '@astrojs/node';
import webvitals from '@astrojs/web-vitals';
// import studioCMS from '@astrolicious/studiocms';
// import studioCMSBlog from '@astrolicious/studiocms-blog';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://demo.astro-studiocms.xyz/',
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		db(),
		webvitals(),
		// studioCMS(), // StudioCMS Integration options can be found in `studiocms.config.mjs`
		// studioCMSBlog({
		// 	config: {
		// 		title: 'StudioCMS Test Blog',
		// 		description: 'A simple blog built with Astro and StudioCMS',
		// 	},
		// }),
	],
});

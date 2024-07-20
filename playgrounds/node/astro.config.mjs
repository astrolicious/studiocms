import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import webvitals from '@astrojs/web-vitals';
import node from '@astrojs/node';
import studioCMS from '@astrolicious/studiocms';
// import studioCMSBlog from '@astrolicious/studiocms-blog';

// https://astro.build/config
export default defineConfig({
	site: 'https://demo.astro-studiocms.xyz/',
	output: 'server',
	adapter: node({ mode: "standalone" }),
	integrations: [ 
		db(), 
		webvitals(),
		studioCMS(), // StudioCMS Integration options can be found in `studiocms.config.mjs`
		// studioCMSBlog({
		// 	config: {
		// 		title: 'StudioCMS Test Blog',
		// 		description: 'A simple blog built with Astro and StudioCMS',
		// 	},
		// }), 
	], 
});

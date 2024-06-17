import db from '@astrojs/db';
import node from '@astrojs/node';
import studioCMS from '@astrolicious/studiocms';
import { defineConfig } from 'astro/config';
import blog from '@astrolicious/studiocms-blog';


// https://astro.build/config
export default defineConfig({
	site: 'https://demo.astro-studiocms.xyz/',
	output: 'server',
	adapter: node({ mode: "standalone" }),
	integrations: [ 
		db(), 
		studioCMS(), // StudioCMS Integration options can be found in `studiocms.config.mjs`
		blog({
			config: {
				title: 'StudioCMS Test Blog',
				description: 'A simple blog built with Astro and StudioCMS',
			},
		}), 
	], 

});

import db from '@astrojs/db';
import node from '@astrojs/node';
import webvitals from '@astrojs/web-vitals';
import studioCMSBlog from '@studiocms/blog';
import { defineConfig } from 'astro/config';
import studioCMS from 'studiocms';
import { getCoolifyURL } from '../../www/hostUtils';

// https://astro.build/config
export default defineConfig({
	site: getCoolifyURL(true) || 'https://demo.studiocms.xyz/',
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [
		db(),
		webvitals(),
		studioCMS(), // StudioCMS Integration options can be found in `studiocms.config.mjs`
		studioCMSBlog({
			config: {
				title: 'StudioCMS Test Blog',
				description: 'A simple blog built with Astro and StudioCMS',
			},
		}),
	],
image: {
		remotePatterns: [
			{
				protocol: 'https',
			},
		],
	},
});

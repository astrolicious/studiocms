import { defineConfig } from 'astro/config';
import db from '@astrojs/db';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel/serverless';

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	output: "server",
	adapter: vercel(),
	integrations: [db(), sitemap()],
	image: {
		domains: ['res.cloudinary.com']
	}
});

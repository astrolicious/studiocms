import { defineConfig } from "astro/config";
import studioCMS from "@nametbd/astro-studio-cms";
import db from '@astrojs/db';
import vercel from "@astrojs/vercel/serverless";

// https://astro.build/config
export default defineConfig({
	site: 'https://example.com',
	output: "server",
	adapter: vercel(),
	integrations: [
		db(),
		studioCMS({ 
			siteAdmins: ['Adammatthiesen'],
			verbose: true,
		}),
	],
});

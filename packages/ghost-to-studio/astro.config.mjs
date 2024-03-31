import db from '@astrojs/db';
import node from '@astrojs/node';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'http://localhost:4321',
	output: 'server',
	adapter: node({ mode: 'standalone' }),
	integrations: [db()],
});

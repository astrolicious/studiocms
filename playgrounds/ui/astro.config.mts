import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://ui-testing.studiocms.xyz',
	output: 'static',
	experimental: {
		directRenderScript: true,
	},
});

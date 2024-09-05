import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { getCoolifyURL } from '../hostUtils';

// https://astro.build/config
export default defineConfig({
	site: getCoolifyURL(true) || 'https://astro-studiocms.xyz',
	image: {
		remotePatterns: [
			{
				protocol: 'https',
			},
		],
	},
	integrations: [icon(), tailwind()],
});

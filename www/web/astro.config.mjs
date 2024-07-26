import tailwind from '@astrojs/tailwind';
import icon from 'astro-icon';
import { defineConfig, squooshImageService } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://astro-studiocms.xyz',
	image: {
		service: squooshImageService(),
		remotePatterns: [
			{
				protocol: 'https',
			},
		],
	},
	integrations: [icon(), tailwind()],
});

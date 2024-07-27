import { defineUtility } from 'astro-integration-kit';

export const updateAstroConfig = defineUtility('astro:config:setup')((params) => {
	params.updateConfig({
		vite: {
			build: {
				rollupOptions: {
					external: ['@matthiesenxyz/integration-utils'],
				},
			},
		},
	});
});

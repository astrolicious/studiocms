import { StudioCMSOptionsSchema as optionsSchema } from '@studiocms/core/schemas';
import { createResolver, defineIntegration } from 'astro-integration-kit';
import { name } from '../package.json';
import { makeFrontend } from './utils/makeFrontend';

export default defineIntegration({
	name,
	optionsSchema,
	setup({ options }) {
		// Create resolver relative to this file
		const { resolve } = createResolver(import.meta.url);

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					// Create the default frontend Routes
					makeFrontend(params, {
						options,
						default404Route: resolve('./routes/404.astro'),
						routes: [
							{ pattern: '/', entrypoint: resolve('./routes/index.astro') },
							{ pattern: '[...slug]', entrypoint: resolve('./routes/[...slug].astro') },
						],
					});
				},
			},
		};
	},
});

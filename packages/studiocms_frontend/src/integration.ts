import { createResolver, defineIntegration } from 'astro-integration-kit';
import { name } from '../package.json';
import { StudioCMSFrontEndOptionsSchema } from './schema';
import { makeFrontend } from './utils/makeFrontend';

/**
 * StudioCMS Frontend Integration
 */
export default defineIntegration({
	name,
	optionsSchema: StudioCMSFrontEndOptionsSchema,
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

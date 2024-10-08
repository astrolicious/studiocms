import { createResolver, defineIntegration, injectDevRoute } from 'astro-integration-kit';
import { name, version } from '../package.json';
import { optionsSchema } from './schema';

// Main Integration
export default defineIntegration({
	name,
	optionsSchema,
	setup({
		name,
		options: {
			appsConfig: { libSQLViewer },
			verbose,
		},
	}) {
		const { resolve } = createResolver(import.meta.url);
		return {
			hooks: {
				'astro:config:setup': async (params) => {
					// Destructure Params
					const { logger, addDevToolbarApp, command } = params;

					// Log
					logger.info(`Starting, Version: ${version}`);

					// Log Verbose
					if (verbose) {
						logger.info(`[${name}] Verbose Mode`);
					}

					// Enforce dev mode only
					if (command === 'dev') {
						// Add Dev Toolbar App
						if (libSQLViewer.enabled) {
							verbose && logger.info('Adding Dev Toolbar App: libSQLViewer');
							injectDevRoute(params, {
								entrypoint: resolve('routes/libsql-viewer.astro'),
								pattern: '/_studiocms-devapps/libsql-viewer',
							});
							addDevToolbarApp({
								name: 'libSQL Viewer',
								id: 'libsql-viewer',
								icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6"><path stroke-linecap="round" stroke-linejoin="round" d="M20.25 6.375c0 2.278-3.694 4.125-8.25 4.125S3.75 8.653 3.75 6.375m16.5 0c0-2.278-3.694-4.125-8.25-4.125S3.75 4.097 3.75 6.375m16.5 0v11.25c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125V6.375m16.5 0v3.75m-16.5-3.75v3.75m16.5 0v3.75C20.25 16.153 16.556 18 12 18s-8.25-1.847-8.25-4.125v-3.75m16.5 0c0 2.278-3.694 4.125-8.25 4.125s-8.25-1.847-8.25-4.125" /></svg>`,
								entrypoint: resolve('./apps/libsqlViewer'),
							});
						}
					}
				},
			},
		};
	},
});

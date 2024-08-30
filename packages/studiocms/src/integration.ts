import { runtimeLogger } from '@inox-tools/runtime-logger';
import { addIntegrationArray } from '@matthiesenxyz/integration-utils/aikUtils';
import {
	integrationLogger,
	nodeNamespaceBuiltinsAstro,
} from '@matthiesenxyz/integration-utils/astroUtils';
import {
	CoreStrings,
	type StudioCMSOptions,
	StudioCMSOptionsSchema,
	addIntegrationArrayWithCheck,
	checkAstroConfig,
	configResolver,
	getStudioConfigFileUrl,
	robotsTXTPreset,
	studioCMSPluginList,
} from '@studiocms/core';
import studioCMSCore from '@studiocms/core';
import studioCMSFrontend from '@studiocms/frontend';
import studiocmsImageHandler from '@studiocms/imagehandler';
import studioCMSRobotsTXT from '@studiocms/robots-txt';
import { createResolver, defineIntegration } from 'astro-integration-kit';

// Main Integration
export default defineIntegration({
	name: 'studiocms',
	optionsSchema: StudioCMSOptionsSchema,
	setup({ name, options }) {
		// Register StudioCMS into the StudioCMS Plugin List
		studioCMSPluginList.set('studiocms', { name, label: 'StudioCMS' });

		// Create Resolver for Virtual Imports
		const { resolve } = createResolver(import.meta.url);

		let resolvedOptions: StudioCMSOptions;

		return {
			hooks: {
				// Configure `@astrojs/db` integration to include the StudioCMS Database Tables
				'astro:db:setup': ({ extendDb }) => {
					extendDb({ configEntrypoint: resolve('./db/config.ts') });
				},
				'astro:config:setup': async (params) => {
					// Destructure Params
					const { config: astroConfig, addWatchFile, logger } = params;

					// Watch the StudioCMS Config File for changes (including creation/deletion)
					addWatchFile(getStudioConfigFileUrl(astroConfig.root));

					// Resolve Options
					resolvedOptions = await configResolver(params, options);

					// Create Runtime compatible Logger
					runtimeLogger(params, { name: 'StudioCMS' });

					// Setup Logger
					integrationLogger(
						{ logger, logLevel: 'info', verbose: resolvedOptions.verbose },
						CoreStrings.Start
					);

					// Check Astro Config for required settings
					checkAstroConfig(params);

					// Setup Integrations (Internal)
					addIntegrationArray(params, [
						{ integration: nodeNamespaceBuiltinsAstro() },
						{ integration: studioCMSCore(resolvedOptions) },
						{ integration: studioCMSFrontend(resolvedOptions) },
						{ integration: studiocmsImageHandler(resolvedOptions) },
					]);

					// Setup Integrations (External / Optional)
					addIntegrationArrayWithCheck(params, [
						{
							enabled: resolvedOptions.includedIntegrations.useAstroRobots,
							knownSimilar: ['astro-robots', 'astro-robots-txt'],
							integration: studioCMSRobotsTXT({
								...robotsTXTPreset,
								...resolvedOptions.includedIntegrations.astroRobotsConfig,
							}),
						},
					]);
				},
			},
		};
	},
});

import { addIntegrationArray } from '@matthiesenxyz/integration-utils/aikUtils';
import {
	integrationLogger,
	nodeNamespaceBuiltinsAstro,
} from '@matthiesenxyz/integration-utils/astroUtils';
import {
	CoreStrings,
	type StudioCMSOptions,
	addIntegrationArrayWithCheck,
	checkAstroConfig,
	configResolver,
	getStudioConfigFileUrl,
	StudioCMSOptionsSchema as optionsSchema,
	robotsTXTPreset,
	studioCMSPluginList,
} from '@studiocms/core';
import studioCMSCore from '@studiocms/core';
import studioCMSDashboard from '@studiocms/dashboard';
import studioCMSFrontend from '@studiocms/frontend';
import studiocmsImageHandler from '@studiocms/imagehandler';
import studiocmsRenderers from '@studiocms/renderers';
import studioCMSRobotsTXT from '@studiocms/robotstxt';
import { defineIntegration } from 'astro-integration-kit';
import { name } from '../package.json';

// Main Integration
export default defineIntegration({
	name,
	optionsSchema,
	setup({ name, options }) {
		// Register StudioCMS into the StudioCMS Plugin List
		studioCMSPluginList.set(name, { name, label: 'StudioCMS' });

		let resolvedOptions: StudioCMSOptions;

		return {
			hooks: {
				// Configure `@astrojs/db` integration to include the StudioCMS Database Tables
				'astro:db:setup': ({ extendDb }) => {
					extendDb({ configEntrypoint: '@studiocms/core/db/config' });
				},
				'astro:config:setup': async (params) => {
					// Destructure Params
					const { config: astroConfig, addWatchFile, logger } = params;

					// Watch the StudioCMS Config File for changes (including creation/deletion)
					addWatchFile(getStudioConfigFileUrl(astroConfig.root));

					// Resolve Options
					resolvedOptions = await configResolver(params, options);

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
						{ integration: studiocmsRenderers() },
						{ integration: studioCMSDashboard(resolvedOptions) },
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

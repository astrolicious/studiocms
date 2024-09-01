import { addIntegrationArray } from '@matthiesenxyz/integration-utils/aikUtils';
import {
	integrationLogger,
	nodeNamespaceBuiltinsAstro,
} from '@matthiesenxyz/integration-utils/astroUtils';
import studioCMSCore from '@studiocms/core';
import { getStudioConfigFileUrl, studioCMSPluginList } from '@studiocms/core/lib';
import {
	type StudioCMSOptions,
	StudioCMSOptionsSchema as optionsSchema,
} from '@studiocms/core/schemas';
import { CoreStrings, robotsTXTPreset } from '@studiocms/core/strings';
import {
	addIntegrationArrayWithCheck,
	checkAstroConfig,
	configResolver,
} from '@studiocms/core/utils';
import studioCMSDashboard from '@studiocms/dashboard';
import studioCMSFrontend from '@studiocms/frontend';
import studiocmsImageHandler from '@studiocms/imagehandler';
import studiocmsRenderers from '@studiocms/renderers';
import studioCMSRobotsTXT from '@studiocms/robotstxt';
import { defineIntegration } from 'astro-integration-kit';
import { name, version } from '../package.json';
import { updateCheck } from './updateCheck';

// Main Integration
export default defineIntegration({
	name,
	optionsSchema,
	setup({ name, options }) {
		// Register StudioCMS into the StudioCMS Plugin List
		studioCMSPluginList.set(name, { name, label: 'StudioCMS' });

		// Resolve Options
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
				'astro:server:start': async (params) => {
					// Check for Updates on Development Server Start
					updateCheck(params, name, version);
				},
			},
		};
	},
});

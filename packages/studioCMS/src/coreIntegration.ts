import { checkAstroConfig, studioLogger, studioLoggerOptsResolver, makeFrontend, addIntegrationArray, addIntegrationArrayWithCheck } from './utils';
import { studioCMSRobotsTXT, studioCMSImageHandler, studioCMSDashboard } from './integrations';
import { addDts, addVirtualImports, createResolver, defineIntegration } from 'astro-integration-kit';
import 'astro-integration-kit/types/db';
import { optionsResolver, vResolver } from './resolvers';
// import inoxsitemap from '@inox-tools/sitemap-ext';
import { studioCMSPluginList } from '.';
import { getStudioConfigFileUrl } from './studiocms-config';
import { optionsSchema } from './schemas';
import { version } from '../package.json';
import { CoreStrings, robotsTXTPreset } from './strings';
import { namespaceBuiltinsPlugin } from './utils/namespaceBuiltins';

// Main Integration
export default defineIntegration({
	name: '@astrolicious/studiocms',
	optionsSchema, 
	setup({ name, options }) {

		// Register StudioCMS Core as First Plugin
		studioCMSPluginList.set('@astrolicious/studiocms', { name: '@astrolicious/studiocms', label: 'StudioCMS' });
		
		// Create Resolver for Virtual Imports
		const { resolve } = createResolver(import.meta.url);

		return {
			hooks: {
				'astro:db:setup': ({ extendDb }) => { 
					// Configure `@astrojs/db` integration to include the StudioCMS Database Table Schema
					extendDb({ configEntrypoint: resolve('./db/config.ts') });
				},
				'astro:config:setup': async ( params ) => {

					// Destructure Params
					const { config: astroConfig, addWatchFile, updateConfig } = params;

					// Watch the StudioCMS Config File for changes (including creation/deletion)
					addWatchFile(getStudioConfigFileUrl(astroConfig.root));

					// Resolve Options
					const resolvedOptions = await optionsResolver(params, options);

					updateConfig({
						vite: { plugins: [namespaceBuiltinsPlugin()] }
					})

					// Setup Logger
					const LoggerOpts = await studioLoggerOptsResolver(params.logger, resolvedOptions.verbose);
					studioLogger(LoggerOpts.logInfo, CoreStrings.Start);

					// Check for SSR Mode (output: "server") & Site URL
					// TODO: Add support for "hybrid" mode
					checkAstroConfig(astroConfig, LoggerOpts);

					// Create Resolver for User-Defined Virtual Imports
					const { resolve: rootResolve } = createResolver(astroConfig.root.pathname);

					// Create Virtual Resolver
					const { virtualImportMap, dtsFile } = vResolver({ 
						overrides: {
							FormattedDateOverride: resolvedOptions.overrides.FormattedDateOverride && 
								rootResolve(resolvedOptions.overrides.FormattedDateOverride),
						 }, 
						 imports: { resolvedOptions, version, astroConfig }
					});

					// Add Virtual Imports
					studioLogger(LoggerOpts.logInfo, CoreStrings.AddVirtualImports);
					addVirtualImports(params, { name, imports: virtualImportMap });

					// Add Virtual DTS File
					studioLogger(LoggerOpts.logInfo, CoreStrings.AddVirtualDTS);
					addDts(params, { name, content: dtsFile });

					// Generate Default Frontend Routes if Enabled
					makeFrontend(params, {
						resolvedOptions, LoggerOpts, 
						default404Route: resolve('./defaultRoutes/404.astro'),
						defaultRoutes: [
							{ pattern: '/', entrypoint: resolve('./defaultRoutes/index.astro') },
							{ pattern: '[...slug]', entrypoint: resolve('./defaultRoutes/[...slug].astro') }
						],
					});

					// Add Internal Integrations
					addIntegrationArray(params, { 
						LoggerOpts,
						integrations: [ 
							studioCMSDashboard(resolvedOptions), 
							studioCMSImageHandler(resolvedOptions) 
						],
					});

					// Add External Integrations
					addIntegrationArrayWithCheck(params, {
						LoggerOpts,
						integrations: [
							{ 
								enabled: resolvedOptions.includedIntegrations.useAstroRobots, 
								knownSimilar: ['astro-robots-txt', 'astro-robots'], 
								integration: studioCMSRobotsTXT({ 
									...robotsTXTPreset, ...resolvedOptions.includedIntegrations.astroRobotsConfig 
								}) 
							}, 
							// {
							// 	enabled: resolvedOptions.includedIntegrations.useInoxSitemap,
							// 	knownSimilar: ['@astrojs/sitemap', '@inox-tools/sitemap-ext', '@inox-tools/declarative-sitemap'],
							// 	integration: inoxsitemap()
							// }
						]
					});

					// Log Setup Complete
					studioLogger(LoggerOpts.logInfo, CoreStrings.SetupComplete);
				},
			},
		};
	},
});

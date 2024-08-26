import { runtimeLogger } from '@inox-tools/runtime-logger';
import {
	addVirtualImports,
	addVitePlugin,
	createResolver,
	defineIntegration,
} from 'astro-integration-kit';
// import inoxsitemap from '@inox-tools/sitemap-ext'; - Disabled for now
import { studioCMSPluginList } from '.';
import { version } from '../package.json';
import { studioCMSDashboard, studioCMSImageHandler, studioCMSRobotsTXT } from './integrations';
import { optionsResolver, vResolver } from './resolvers';
import { optionsSchema, type StudioCMSOptions } from './schemas';
import { CoreStrings, robotsTXTPreset } from './strings';
import { getStudioConfigFileUrl } from './studiocms-config';
import {
	addIntegrationArray,
	addIntegrationArrayWithCheck,
	checkAstroConfig,
	makeFrontend,
	studioLogger,
	studioLoggerOptsResolver,
} from './utils';
import { namespaceBuiltinsPlugin } from './utils/namespaceBuiltins';

// Main Integration
export default defineIntegration({
	name: '@astrolicious/studiocms',
	optionsSchema,
	setup({ name, options }) {
		// Register StudioCMS Core as First Plugin
		studioCMSPluginList.set('@astrolicious/studiocms', {
			name: '@astrolicious/studiocms',
			label: 'StudioCMS',
		});

		let resolvedOptions: StudioCMSOptions;
		let dtsFile: string;

		// Create Resolver for Virtual Imports
		const { resolve } = createResolver(import.meta.url);

		return {
			hooks: {
				'astro:db:setup': ({ extendDb }) => {
					// Configure `@astrojs/db` integration to include the StudioCMS Database Table Schema
					extendDb({ configEntrypoint: resolve('./db/config.ts') });
				},
				'astro:config:setup': async (params) => {
					// Destructure Params
					const { config: astroConfig, addWatchFile } = params;

					// Watch the StudioCMS Config File for changes (including creation/deletion)
					addWatchFile(getStudioConfigFileUrl(astroConfig.root));

					// Resolve Options
					resolvedOptions = await optionsResolver(params, options);

					// Add Namespace Builtins Plugin for vite
					addVitePlugin(params, { plugin: namespaceBuiltinsPlugin() });

					// Create Runtime Logger
					runtimeLogger(params, { name: 'StudioCMS' });

					// Setup Logger
					const LoggerOpts = await studioLoggerOptsResolver(params.logger, resolvedOptions.verbose);
					studioLogger(LoggerOpts.logInfo, CoreStrings.Start);

					// Check for SSR Mode (output: "server") & Site URL
					// TODO: Add support for "hybrid" mode
					checkAstroConfig(astroConfig, LoggerOpts);

					// Create Resolver for User-Defined Virtual Imports
					const { resolve: rootResolve } = createResolver(astroConfig.root.pathname);

					// Create Virtual Resolver
					const { virtualImportMap, dtsFile: resolvedDts } = vResolver({
						overrides: {
							FormattedDateOverride:
								resolvedOptions.overrides.FormattedDateOverride &&
								rootResolve(resolvedOptions.overrides.FormattedDateOverride),
						},
						imports: { resolvedOptions, version, astroConfig },
					});

					dtsFile = resolvedDts;

					// Add Virtual Imports
					studioLogger(LoggerOpts.logInfo, CoreStrings.AddVirtualImports);
					addVirtualImports(params, { name, imports: virtualImportMap });

					// Generate Default Frontend Routes if Enabled
					makeFrontend(params, {
						resolvedOptions,
						LoggerOpts,
						default404Route: resolve('./defaultRoutes/404.astro'),
						defaultRoutes: [
							{ pattern: '/', entrypoint: resolve('./defaultRoutes/index.astro') },
							{ pattern: '[...slug]', entrypoint: resolve('./defaultRoutes/[...slug].astro') },
						],
					});

					// Add Internal Integrations
					addIntegrationArray(params, {
						LoggerOpts,
						integrations: [
							studioCMSDashboard(resolvedOptions),
							studioCMSImageHandler(resolvedOptions),
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
									...robotsTXTPreset,
									...resolvedOptions.includedIntegrations.astroRobotsConfig,
								}),
							},
							// - Disabled for now
							// {
							// 	enabled: resolvedOptions.includedIntegrations.useInoxSitemap,
							// 	knownSimilar: ['@astrojs/sitemap', '@inox-tools/sitemap-ext', '@inox-tools/declarative-sitemap'],
							// 	integration: inoxsitemap()
							// }
						],
					});

					// Log Setup Complete
					studioLogger(LoggerOpts.logInfo, CoreStrings.SetupComplete);
				},
				'astro:config:done': async (params) => {
					// Add Virtual DTS File
					studioLogger(
						(await studioLoggerOptsResolver(params.logger, resolvedOptions.verbose)).logInfo,
						CoreStrings.AddVirtualDTS
					);
					params.injectTypes({
						filename: 'core.d.ts',
						content: dtsFile,
					});
				},
			},
		};
	},
});

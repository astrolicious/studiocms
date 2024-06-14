import { addDts, addIntegration, addVirtualImports, createResolver, defineIntegration, hasIntegration } from 'astro-integration-kit';
import 'astro-integration-kit/types/db';
import { DTSResolver, ImportMapResolver, MakeVirtualImportMaps, VirtualResolver, oResolver } from './resolvers';
import { studioCMSRobotsTXT, studioCMSImageHandler, studioCMSDashboard } from './integrations';
import inoxsitemap from '@inox-tools/sitemap-ext';
import { studioCMSPluginList, externalNavigation } from './plugintools';
import { getStudioConfigFileUrl } from './studiocms-config';
import { checkAstroConfig, studioLogger, studioLoggerOptsResolver } from './utils';
import { optionsSchema } from './schemas';
import { version } from '../package.json';
import { makeFrontend } from './makeFrontend';

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
					extendDb({ configEntrypoint: resolve('./db/config.ts') }) 
				},
				'astro:config:setup': async ( params ) => {

					// Destructure Params
					const { config: astroConfig, addWatchFile } = params;

					// Watch the StudioCMS Config File for changes (including creation/deletion)
					addWatchFile(getStudioConfigFileUrl(astroConfig.root))

					// Resolve Options
					const resolvedOptions = await oResolver(params, options)

					// Destructure Options
					const { 
						verbose,
						overrides,
						imageService: ImageServiceConfig,
						includedIntegrations
					} = resolvedOptions;

					// Setup Logger
					const LoggerOpts = await studioLoggerOptsResolver(params.logger, resolvedOptions.verbose);
					studioLogger(LoggerOpts.logInfo, 'Setting up StudioCMS Core...');

					// Check for SSR Mode (output: "server") & Site URL
					// TODO: Add support for "hybrid" mode
					checkAstroConfig(astroConfig, LoggerOpts);

					// Create Resolver for User-Defined Virtual Imports
					const { resolve: rootResolve } = createResolver(astroConfig.root.pathname)

					// Create Virtual Resolver
					const virtualResolver = VirtualResolver(
						overrides.CustomImageOverride && rootResolve(overrides.CustomImageOverride), 
						overrides.FormattedDateOverride && rootResolve(overrides.FormattedDateOverride),
					)

					// Add Virtual Imports
					studioLogger(LoggerOpts.logInfo, "Adding Virtual Imports...")
					addVirtualImports(params, { 
						name, imports: ImportMapResolver({ 
							resolvedOptions, 
							version, 
							externalNavigation, 
							astroConfig, 
							...MakeVirtualImportMaps(virtualResolver)
						}) 
					});
					studioLogger(LoggerOpts.logInfo, "Virtual Imports Added!")

					// Add Virtual DTS File
					studioLogger(LoggerOpts.logInfo, "Creating and Adding Virtual DTS File...")
					addDts(params, { name, content: DTSResolver(virtualResolver) });
					studioLogger(LoggerOpts.logInfo, "Virtual DTS File Added!")

					// Generate Default Frontend Routes if Enabled
					makeFrontend(params, {
						resolvedOptions, LoggerOpts, 
						defaultRoutes: [
							{ pattern: '/', entrypoint: resolve('./defaultRoutes/index.astro') },
							{ pattern: '[...slug]', entrypoint: resolve('./defaultRoutes/[...slug].astro') }
						],
						default404Route: resolve('./defaultRoutes/404.astro')
					})

					// Add Dashboard Integration
					addIntegration(params, {
						integration: studioCMSDashboard(resolvedOptions)
					})

					// Add Image Service Handler Integration
					addIntegration(params, { 
						integration: studioCMSImageHandler({ ImageServiceConfig, verbose })
					})

					// Robots.txt Integration
					if (includedIntegrations.useAstroRobots) {
						if (
							!hasIntegration(params, { name: 'astro-robots-txt' }) ||
							!hasIntegration(params, { name: 'astro-robots' })
						) {
							studioLogger(LoggerOpts.logInfo, 'No known robotstxt integration found. Adding `studioCMS:RobotsTXT` integration');
							addIntegration(params, {
								integration: studioCMSRobotsTXT({
									policy: [
										{
											userAgent: ['*'],
											allow: ['/'],
											disallow: ['/dashboard/'],
										},
									], ...includedIntegrations.astroRobotsConfig
								},),
							});
						}
					}

					//
					// Third-Party Integrations
					//
						// Sitemap Integration
						if (includedIntegrations.useInoxSitemap) {
							if (
								!hasIntegration(params, { name: '@astrojs/sitemap' }) ||
								!hasIntegration(params, { name: '@inox-tools/sitemap-ext' })
							) {
								studioLogger(LoggerOpts.logInfo, 'No known sitemap integration found. Adding `@inox-tools/sitemap-ext` integration');
								addIntegration(params, { 
									integration: inoxsitemap() 
								});
							}
						}

					// Log Setup Complete
					studioLogger(LoggerOpts.logInfo, 'StudioCMS Core Setup Complete.');
				},
			},
		};
	},
});

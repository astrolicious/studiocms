import { addDts, addIntegration, addVirtualImports, createResolver, defineIntegration, hasIntegration } from 'astro-integration-kit';
import 'astro-integration-kit/types/db';
import { DTSResolver, ImportMapResolver, MakeVirtualImportMaps, VirtualResolver, optionResolver } from './resolvers';
import { studioCMSRobotsTXT, studioCMSImageHandler, studioCMSDashboard } from './integrations';
import inoxsitemap from '@inox-tools/sitemap-ext';
import { studioCMSPluginList, externalNavigation } from './plugintools';
import { getStudioConfigFileUrl } from './studiocms-config';
import { checkAstroConfig, integrationLogger } from './utils';
import { optionsSchema } from './schemas';
import { version } from '../package.json';

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
					const {
						logger,
						config: astroConfig,
						addWatchFile,
						injectRoute,
					} = params;

					// Watch the StudioCMS Config File for changes (including creation/deletion)
					addWatchFile(getStudioConfigFileUrl(astroConfig.root))

					// Resolve Options
					const resolvedOptions = await optionResolver(astroConfig, options, logger)

					// Destructure Options
					const {
						verbose,
						dbStartPage,
						imageService: ImageServiceConfig,
						defaultFrontEndConfig: {
							injectDefaultFrontEndRoutes,
							inject404Route,
						},
						includedIntegrations: { 
							useAstroRobots, 
							astroRobotsConfig,
							useInoxSitemap
						},
						overrides: {
							CustomImageOverride,
							FormattedDateOverride
						}
					} = resolvedOptions;

					// Check for SSR Mode (output: "server") & Site URL
					// TODO: Add support for "hybrid" mode
					checkAstroConfig(astroConfig, logger);

					// Create Resolver for User-Defined Virtual Imports
					const { resolve: rootResolve } = createResolver(astroConfig.root.pathname)

					// Create Virtual Resolver
					const virtualResolver = VirtualResolver(
						CustomImageOverride && rootResolve(CustomImageOverride), 
						FormattedDateOverride && rootResolve(FormattedDateOverride),
					)

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, { 
						name, imports: ImportMapResolver({ 
							resolvedOptions, 
							version, 
							externalNavigation, 
							astroConfig, 
							...MakeVirtualImportMaps(virtualResolver)
						}) 
					});

					// Add Virtual DTS File
					addDts(params, { name, content: DTSResolver(virtualResolver) });

					if (!dbStartPage) {
						integrationLogger(logger, verbose, 'info', "Database Start Page disabled. Skipping Database Setup.");

						// Inject Default Frontend Routes
						if (injectDefaultFrontEndRoutes) {
							integrationLogger(logger, verbose, 'info', 'Injecting Default Frontend Routes...');
							injectRoute({
								pattern: '/',
								entrypoint: resolve('./defaultRoutes/index.astro')
							});
							injectRoute({
								pattern: '[...slug]',
								entrypoint: resolve('./defaultRoutes/[...slug].astro')
							})
						}

						// Inject 404 Route
						if (inject404Route) {
							integrationLogger(logger, verbose, 'info', 'Injecting 404 Route...');
							injectRoute({
								pattern: '404',
								entrypoint: resolve('./defaultRoutes/404.astro')
							})
						}
					}

					// Add Dashboard Integration
					addIntegration(params, {
						integration: studioCMSDashboard(resolvedOptions)
					})

					// Add Image Service Handler Integration
					addIntegration(params, { 
						integration: studioCMSImageHandler({ ImageServiceConfig, verbose })
					})

					// Robots.txt Integration
					if (useAstroRobots) {
						if (
							!hasIntegration(params, { name: 'astro-robots-txt' }) ||
							!hasIntegration(params, { name: 'astro-robots' })
						) {
							integrationLogger(
								logger,
								verbose,
								'info',
								'No known robotstxt integration found. Adding `studioCMS:RobotsTXT` integration'
							);
							addIntegration(params, {
								integration: studioCMSRobotsTXT({
									policy: [
										{
											userAgent: ['*'],
											allow: ['/'],
											disallow: ['/dashboard/'],
										},
									], ...astroRobotsConfig
								},),
							});
						}
					}

					// Sitemap Integration
					if (useInoxSitemap) {
						if (
							!hasIntegration(params, { name: '@astrojs/sitemap' }) ||
							!hasIntegration(params, { name: '@inox-tools/sitemap-ext' })
						) {
							integrationLogger(
								logger,
								verbose,
								'info',
								'No known sitemap integration found. Adding `@inox-tools/sitemap-ext` integration'
							);
							addIntegration(params, { 
								integration: inoxsitemap() 
							});
						}
					}

					integrationLogger(logger, verbose, 'info', 'StudioCMS Core Setup Complete.');
				},
			},
		};
	},
});

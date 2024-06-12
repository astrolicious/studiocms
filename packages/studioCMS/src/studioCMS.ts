import { addDts, addIntegration, addVirtualImports, createResolver, defineIntegration, hasIntegration } from 'astro-integration-kit';
import 'astro-integration-kit/types/db';
import { DTSResolver, ImportMapResolver, MakeVirtualImportMaps, VirtualResolver, optionResolver } from './resolvers';
import { studioCMSRobotsTXT, studioCMSImageHandler, studioCMSDashboard } from './integrations';
import inoxsitemap from '@inox-tools/sitemap-ext';
import { studioCMSPluginList, externalNavigation } from '.';
import { AstroError } from 'astro/errors';
import { getStudioConfigFileUrl } from './studiocms-config';
import { integrationLogger } from './utils';
import { optionsSchema } from './schemas';
import { DbErrors, warnings } from './strings';
import { version } from '../package.json';

// Main Integration
export default defineIntegration({
	name: '@astrolicious/studiocms',
	optionsSchema, 
	setup({ name, options }) {

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
					const mergedOptions = await optionResolver(astroConfig, options, logger)

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
					} = mergedOptions;

					// Log that the StudioCMS config file is being used if verbose
					integrationLogger(logger, verbose, 'warn', warnings.StudioCMSConfigPresent);

					// Check for SSR Mode (output: "server")
					// TODO: Add support for "hybrid" mode
					if (astroConfig.output !== 'server') {
						throw new AstroError(DbErrors.AstroConfigOutput);
					}

					// Check for Site URL
					if (!astroConfig.site) {
						throw new AstroError(DbErrors.AstroConfigSiteURL);
					}

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
							mergedOptions, 
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
						integration: studioCMSDashboard(mergedOptions)
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

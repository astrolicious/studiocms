import {
	addDts,
	addIntegration,
	addVirtualImports,
	createResolver,
	defineIntegration,
	hasIntegration,
} from 'astro-integration-kit';
import 'astro-integration-kit/types/db';
import { AstroError } from 'astro/errors';
import { integrationLogger } from './utils';
import { optionsSchema, type StudioCMSOptions } from './schemas';
import inoxsitemap from '@inox-tools/sitemap-ext';
import studioCMSRobotsTXT from './integrations/robotstxt';
import studioCMSImageHandler from './integrations/imageHandler';
import studioCMSDashboard from './integrations/studioCMSDashboard';
import { DbErrors, studioErrors, warnings } from './strings';
import { getStudioConfigFileUrl, loadStudioCMSConfigFile } from './studiocms-config';
import { studioCMSPluginList, externalNavigation } from '.';
import { version } from '../package.json';
import { DTSResolver, VirtualResolver } from './resolvers';

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

					// Merge the given options with the ones from a potential StudioCMS config file
					const studioCMSConfigFile = await loadStudioCMSConfigFile(astroConfig.root);
					let mergedOptions: StudioCMSOptions = { ...options };
					if (studioCMSConfigFile && Object.keys(studioCMSConfigFile).length > 0) {
						const parsedOptions = optionsSchema.safeParse(studioCMSConfigFile);

						// If the StudioCMS config file is invalid, throw an error
						if ( !parsedOptions.success || parsedOptions.error || !parsedOptions.data ) {
							const parsedErrors = parsedOptions.error.errors;
							const parsedErrorMap = parsedErrors.map((e) => ` - ${e.message}`).join('\n');
							const parsedErrorString = `${studioErrors.failedToParseConfig}\n${parsedErrorMap}`;

							integrationLogger(logger, true, 'error', parsedErrorString);
							throw new AstroError(studioErrors.invalidConfigFile, parsedErrorString);
						}

						mergedOptions = { ...optionsSchema._def.defaultValue, ...parsedOptions.data }
					}

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

					// // Create Resolver for User-Defined Virtual Imports
					const { resolve: rootResolve } = createResolver(astroConfig.root.pathname)

					// Virtual Resolver
					const virtResolver = VirtualResolver(
						CustomImageOverride && rootResolve(CustomImageOverride), 
						FormattedDateOverride && rootResolve(FormattedDateOverride),
					)

					// Virtual Components
					const defaultNamedComponents = [
						{ title: "CImage", import: virtResolver.CImage },
						{ title: "FormattedDate", import: virtResolver.FormattedDate },
						{ title: "StudioCMSRenderer", import: virtResolver.StudioCMSRenderer },
						{ title: "Navigation", import: virtResolver.NavigationBar },
						{ title: "Avatar", import: virtResolver.Avatar },
						{ title: "Layout", import: virtResolver.defaultLayout },
					];

					// Virtual Component Map
					let virtualComponentMap = ''
					defaultNamedComponents.map(({ title, import: path }) => {
						virtualComponentMap += `export { default as ${title} } from '${path}';\n`
					})
					virtualComponentMap += `export * from '${virtResolver.contentHelper}';`;

					// Virtual Helpers
					const defaultNamedHelpers = [
						{ title: 'authHelper', import: virtResolver.AuthHelper },
						{ title: 'urlGenFactory', import: virtResolver.UrlGenHelper },
					]
					const miscNamedHelpers = [
						{ import: virtResolver.StudioCMSLocalsMap },
						{ import: virtResolver.StudioCMSDBTypeHelpers },
						{ import: virtResolver.textFormatterHelper },
					]

					// Virtual Helper Map
					let virtualHelperMap = ''
					defaultNamedHelpers.map(({ title, import: path }) => {
						virtualHelperMap += `export { default as ${title} } from '${path}';\n`
					})
					miscNamedHelpers.map(({ import: path }) => {
						virtualHelperMap += `export * from '${path}';\n`
					})
					virtualHelperMap += `export const pluginList = new Map(${JSON.stringify(Array.from(studioCMSPluginList.entries()))});`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'virtual:studiocms/config': `export default ${JSON.stringify(mergedOptions)}`,
							'virtual:studiocms/version': `export default '${version}'`,
							'virtual:studiocms/_nav': `export const externalNav = new Map(${JSON.stringify(Array.from(externalNavigation.entries()))});`,
							'virtual:studiocms/astromdremarkConfig': `export default ${JSON.stringify(astroConfig.markdown)}`,
							'studiocms:components': virtualComponentMap,
							'studiocms:helpers': virtualHelperMap,
						},
					});

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: DTSResolver(virtResolver),
					});

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

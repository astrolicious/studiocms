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
import { fileFactory } from './utils/fileFactory';
import { DbErrors, studioErrors, warnings } from './strings';
import { getStudioConfigFileUrl, loadStudioCMSConfigFile } from './studiocms-config';
import { studioCMSPluginList, externalNavigation, customRendererPlugin } from '.';
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
							layoutOverride: defaultFrontEndLayoutConfig,
						},
						includedIntegrations: { 
							useAstroRobots, 
							astroRobotsConfig,
							useInoxSitemap
						},
						overrides: {
							RendererOverride,
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

					// Renderer Override Path
					let RendererComponentPath: string;

					const RendererOverridePlugin = customRendererPlugin.size > 0 ? Array.from(customRendererPlugin) : null;

					// Check for Custom Renderer Plugin
					if (RendererOverridePlugin) {
						integrationLogger(logger, verbose, 'info', 'Custom Renderer Plugin Detected. Overriding Default Renderer.');
						if (customRendererPlugin.size > 1 && RendererOverridePlugin[0]) {
							integrationLogger(logger, verbose, 'warn', warnings.MultipleRendererPlugins);
							RendererComponentPath = RendererOverridePlugin[0];
						} else if (customRendererPlugin.size > 0 && RendererOverridePlugin[0]) {
							integrationLogger(logger, verbose, 'info', `Using Custom Renderer Plugin: ${RendererOverridePlugin[0]}`);
							RendererComponentPath = RendererOverridePlugin[0];
						}
					} 
					if (RendererOverride && !RendererOverridePlugin) { 
						RendererComponentPath = rootResolve(RendererOverride) 
					} else { 
						RendererComponentPath = resolve('./components/exports/StudioCMSRenderer.astro') 
					}

					// Custom Image Override Path
					let CustomImageComponentPath: string;
					if (CustomImageOverride) {
						CustomImageComponentPath = rootResolve(CustomImageOverride)
					} else {
						CustomImageComponentPath = resolve('./components/exports/CImage.astro')
					}

					// Formatted Date Override Path
					let FormattedDateComponentPath: string;
					if (FormattedDateOverride) {
						FormattedDateComponentPath = rootResolve(FormattedDateOverride)
					} else {
						FormattedDateComponentPath = resolve('./components/exports/FormattedDate.astro')
					}

					// Default Frontend Layout
					let defaultFrontEndLayout: string;
					if (defaultFrontEndLayoutConfig) {
						defaultFrontEndLayout = rootResolve(defaultFrontEndLayoutConfig)
					} else {
						defaultFrontEndLayout = resolve('./defaultRoutes/components/Layout.astro')
					}

					// Virtual Resolver
					const virtResolver = {
						CImage: CustomImageComponentPath,
						FormattedDate: FormattedDateComponentPath,
						StudioCMSRenderer: RendererComponentPath,
						AuthHelper: resolve('./utils/authhelper.ts'),
						StudioCMSLocalsMap: resolve('./schemas/locals.ts'),
						StudioCMSDBTypeHelpers: resolve('./schemas/dbtypehelpers.ts'),
						UrlGenHelper: resolve('./utils/urlGen.ts'),
						textFormatterHelper: resolve('./utils/textFormatter.ts'),
						contentHelper: resolve('./utils/contentHelper.ts'),
						NavigationBar: resolve('./components/exports/Navigation.astro'),
						Avatar: resolve('./components/exports/Avatar.astro'),
						defaultLayout: defaultFrontEndLayout,
					};

					// Virtual Components
					const virtualComponentMap = `
					export { default as CImage } from '${virtResolver.CImage}';
					export { default as FormattedDate } from '${virtResolver.FormattedDate}';
					export { default as StudioCMSRenderer } from '${virtResolver.StudioCMSRenderer}';
					export { default as Navigation } from '${virtResolver.NavigationBar}';
					export { default as Avatar } from '${virtResolver.Avatar}';
					export { default as Layout } from '${virtResolver.defaultLayout}';
					export * from '${virtResolver.contentHelper}';
					`;

					// Virtual Helpers
					const virtualHelperMap = `
					export { default as authHelper } from '${virtResolver.AuthHelper}';
					export { default as urlGenFactory } from '${virtResolver.UrlGenHelper}';
					export * from '${virtResolver.StudioCMSLocalsMap}';
					export * from '${virtResolver.StudioCMSDBTypeHelpers}';
					export * from '${virtResolver.textFormatterHelper}';
					export const pluginList = new Map(${JSON.stringify(Array.from(studioCMSPluginList.entries()))});`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'virtual:studiocms/config': `export default ${JSON.stringify(mergedOptions)}`,
							'virtual:studiocms/version': `export default '${version}'`,
							'virtual:studiocms/_nav': `export const externalNav = new Map(${JSON.stringify(Array.from(externalNavigation.entries()))});`,
							'studiocms:components': virtualComponentMap,
							'studiocms:helpers': virtualHelperMap,
						},
					});

					// Create Virtual DTS File
					const studioCMSDTS = fileFactory();

					// Add Virtual DTS Lines - Components
					studioCMSDTS.addLines(`declare module 'studiocms:components' {
						export type ContentHelperTempResponse = import('${virtResolver.contentHelper}').ContentHelperTempResponse;
						export type SiteConfigResponse = import('${virtResolver.contentHelper}').SiteConfigResponse;
						export type pageDataReponse = import('${virtResolver.contentHelper}').pageDataReponse;
						export type UserResponse = import('${virtResolver.contentHelper}').UserResponse;
						export const CImage: typeof import('${virtResolver.CImage}').default;
						export const FormattedDate: typeof import('${virtResolver.FormattedDate}').default;
						export const StudioCMSRenderer: typeof import('${virtResolver.StudioCMSRenderer}').default;
						export const contentHelper: typeof import('${virtResolver.contentHelper}').contentHelper;
						export const getSiteConfig: typeof import('${virtResolver.contentHelper}').getSiteConfig;
						export const getPageList: typeof import('${virtResolver.contentHelper}').getPageList;
						export const getUserList: typeof import('${virtResolver.contentHelper}').getUserList;
						export const getUserById: typeof import('${virtResolver.contentHelper}').getUserById;
						export const Navigation: typeof import('${virtResolver.NavigationBar}').default;
						export const Avatar: typeof import('${virtResolver.Avatar}').default;
						export const Layout: typeof import('${virtResolver.defaultLayout}').default;
					}`);

					// Add Virtual DTS Lines - Helpers
					studioCMSDTS.addLines(`declare module 'studiocms:helpers' {
						export type Locals = import('${virtResolver.StudioCMSLocalsMap}').Locals;
						export type PageDataAndContent = import('${virtResolver.StudioCMSDBTypeHelpers}').PageDataAndContent;
						export const authHelper: typeof import('${virtResolver.AuthHelper}').default;
						export const LocalsSchema: typeof import('${virtResolver.StudioCMSLocalsMap}').LocalsSchema;
						export const PageDataAndContentSchema: typeof import('${virtResolver.StudioCMSDBTypeHelpers}').PageDataAndContentSchema;
						export const urlGenFactory: typeof import('${virtResolver.UrlGenHelper}').default;
						export const toCamelCase: typeof import('${virtResolver.textFormatterHelper}').toCamelCase;
						export const toPascalCase: typeof import('${virtResolver.textFormatterHelper}').toPascalCase;
						export const pluginList: Map<string, { name: string, label: string }>;
					}`);

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: studioCMSDTS.text(),
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

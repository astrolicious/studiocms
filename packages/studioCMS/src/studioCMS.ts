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
import { DbErrors } from './strings';
import { getStudioConfigFileUrl, loadStudioCMSConfigFile } from './studiocms-config';

// Main Integration
export default defineIntegration({
	name: 'astrolicious/studioCMS',
	optionsSchema,
	setup({ name, options }) {

		// Create Resolver for Virtual Imports
		const { resolve } = createResolver(import.meta.url);

		return {
			hooks: {
				'astro:db:setup': ({ extendDb }) => {
					extendDb({
						configEntrypoint: resolve('./db/config.ts'),
						seedEntrypoint: resolve('./db/seed.ts'),
					});
				},
				'astro:config:setup': async ( params ) => {

					// Destructure Params
					const {
						injectRoute,
						logger,
						config: astroConfig,
						addWatchFile,
					} = params;

					// Watch the StudioCMS Config File for changes (including creation/deletion)
					addWatchFile(getStudioConfigFileUrl(astroConfig.root))

					// Merge the given options with the ones from a potential StudioCMS config file
					const studioCMSConfigFile = await loadStudioCMSConfigFile(astroConfig.root);
					let mergedOptions: StudioCMSOptions = { ...options };
					if (studioCMSConfigFile && Object.keys(studioCMSConfigFile).length > 0) {
						const parsedOptions = optionsSchema.safeParse(studioCMSConfigFile);

						// If the StudioCMS config file is invalid, throw an error
						if (!parsedOptions.success) {
							throw new AstroError("`zod` was unable to parse the StudioCMS config file.");
						}

						mergedOptions = { ...optionsSchema._def.defaultValue, ...parsedOptions.data}
					}

					// Destructure Options
					const {
						verbose,
						dbStartPage,
						imageService: ImageServiceConfig,
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

					// Log that the StudioCMS config file is being used
					if (studioCMSConfigFile && Object.keys(studioCMSConfigFile).length > 0) {
						integrationLogger(logger, verbose, 'warn', `Your project includes a StudioCMS config file ('studiocms.config.mjs'). To avoid unexpected results from merging multiple config sources, move all StudioCMS options to the StudioCMS config file. Or remove the file to use only the options provided in the Astro config.`);
					}

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
					if (RendererOverride) { 
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
					};

					// Virtual Components
					const virtualComponentMap = `
					export { default as CImage } from '${virtResolver.CImage}';
					export { default as FormattedDate } from '${virtResolver.FormattedDate}';
					export { default as StudioCMSRenderer } from '${virtResolver.StudioCMSRenderer}';
					export * from '${virtResolver.contentHelper}';
					`;

					// Virtual Helpers
					const virtualHelperMap = `
					export { default as authHelper } from '${virtResolver.AuthHelper}';
					export * from '${virtResolver.StudioCMSLocalsMap}';
					export * from '${virtResolver.StudioCMSDBTypeHelpers}';
					export { default as urlGenFactory } from '${virtResolver.UrlGenHelper}';
					export * from '${virtResolver.textFormatterHelper}';`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'virtual:studiocms/config': `export default ${JSON.stringify(mergedOptions)}`,
							'studiocms:components': virtualComponentMap,
							'studiocms:helpers': virtualHelperMap,
						},
					});

					// Create Virtual DTS File
					const studioCMSDTS = fileFactory();

					// Add Virtual DTS Lines - Components
					studioCMSDTS.addLines(`declare module 'studiocms:components' {
						export const CImage: typeof import('${virtResolver.CImage}').default;
						export const FormattedDate: typeof import('${virtResolver.FormattedDate}').default;
						export const StudioCMSRenderer: typeof import('${virtResolver.StudioCMSRenderer}').default;
						export type ContentHelperTempResponse = import('${virtResolver.contentHelper}').ContentHelperTempResponse;
						export const contentHelper: typeof import('${virtResolver.contentHelper}').contentHelper;
					}`);

					// Add Virtual DTS Lines - Helpers
					studioCMSDTS.addLines(`declare module 'studiocms:helpers' {
						export const authHelper: typeof import('${virtResolver.AuthHelper}').default;
						export type Locals = import('${virtResolver.StudioCMSLocalsMap}').Locals;
						export const LocalsSchema: typeof import('${virtResolver.StudioCMSLocalsMap}').LocalsSchema;
						export const PageDataAndContentSchema: typeof import('${virtResolver.StudioCMSDBTypeHelpers}').PageDataAndContentSchema;
						export type PageDataAndContent = import('${virtResolver.StudioCMSDBTypeHelpers}').PageDataAndContent;
						export const urlGenFactory: typeof import('${virtResolver.UrlGenHelper}').default;
						export const toCamelCase: typeof import('${virtResolver.textFormatterHelper}').toCamelCase;
						export const toPascalCase: typeof import('${virtResolver.textFormatterHelper}').toPascalCase;
					}`);

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: studioCMSDTS.text(),
					});

					// TODO: Migrate to ATP
					// dbStartPage - Choose whether to run the Start Page or Inject the Integration
					if (dbStartPage) { } else {
						// If dbStartPage is disabled, inject the routes to allow the CMS to function
						integrationLogger(logger, verbose, 'info', 'Adding Page Routes...');
						injectRoute({
							pattern: "/",
							entrypoint: resolve('./pages-frontend/[...slug].astro'),
						});
						injectRoute({
							pattern: "[slug]",
							entrypoint: resolve('./pages-frontend/[...slug].astro'),
						});
						injectRoute({
							pattern: '404',
							entrypoint: resolve('./pages-frontend/404.astro'),
						});
						injectRoute({
							pattern: 'rss.xml',
							entrypoint: resolve('./pages-frontend/rss.xml.ts'),
						});
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

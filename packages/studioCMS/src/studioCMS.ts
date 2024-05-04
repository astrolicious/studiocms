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
import { optionsSchema } from './schemas';
import inoxsitemap from '@inox-tools/sitemap-ext';
import studioCMSRobotsTXT from './integrations/robotstxt';
import studioCMSImageHandler from './integrations/imageHandler';
import studioCMSDashboard from './integrations/studioCMSDashboard';
import { fileFactory } from './utils/fileFactory';
import { DbErrors } from './strings';

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
				'astro:config:setup': ( params ) => {

					// Destructure Params
					const {
						injectRoute,
						logger,
						config: { output, site, root },
					} = params;

					// Destructure Options
					const {
						verbose,
						dbStartPage,
						imageService: ImageServiceConfig,
						dashboardConfig: {
							dashboardEnabled,
						},
						includedIntegrations: { 
							useAstroRobots, 
							astroRobotsConfig,
							useInoxSitemap
						},
						overrides: {
							RendererOverride
						}
					} = options;

					// Check for SSR Mode
					if (output !== 'server') {
						throw new AstroError(DbErrors.AstroConfigOutput);
					}

					// Check for Site URL
					if (!site) {
						throw new AstroError(DbErrors.AstroConfigSiteURL);
					}

					// Create Resolver for User-Defined Virtual Imports
					const { resolve: rootResolve } = createResolver(root.pathname)

					// Renderer Override Path
					let RendererComponentPath: string;
					if (RendererOverride) { 
						RendererComponentPath = rootResolve(RendererOverride) 
					} else { 
						RendererComponentPath = resolve('./components/exports/StudioCMSRenderer.astro') 
					}

					// Virtual Resolver
					const virtResolver = {
						CImage: resolve('./components/exports/CImage.astro'),
						FormattedDate: resolve('./components/exports/FormattedDate.astro'),
						StudioCMSRenderer: RendererComponentPath,
						AuthHelper: resolve('./utils/authhelper.ts'),
						StudioCSMLocalsMap: resolve('./schemas/locals.ts'),
					};

					// Virtual Components
					const virtualComponentMap = `
					export { default as CImage } from '${virtResolver.CImage}';
					export { default as FormattedDate } from '${virtResolver.FormattedDate}';
					export { default as StudioCMSRenderer } from '${virtResolver.StudioCMSRenderer}';`;

					// Virtual Helpers
					const virtualHelperMap = `
					export { default as authHelper } from '${virtResolver.AuthHelper}';
					export * from '${virtResolver.StudioCSMLocalsMap}'`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'virtual:studiocms/config': `export default ${JSON.stringify(options)}`,
							'studiocms:components': virtualComponentMap,
							'studiocms:helpers': virtualHelperMap,
						},
					});

					// Create Virtual DTS File
					const studioCMSDTS = fileFactory();

					studioCMSDTS.addLines(`declare module 'studiocms:components' {
						export const CImage: typeof import('${virtResolver.CImage}').default;
						export const FormattedDate: typeof import('${virtResolver.FormattedDate}').default;
						export const StudioCMSRenderer: typeof import('${virtResolver.StudioCMSRenderer}').default;
					}`);

					studioCMSDTS.addLines(`declare module 'studiocms:helpers' {
						export const authHelper: typeof import('${virtResolver.AuthHelper}').default;
						export type Locals = import('${virtResolver.StudioCSMLocalsMap}').Locals;
						export const LocalsSchema: typeof import('${virtResolver.StudioCSMLocalsMap}').LocalsSchema;
					}`);

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: studioCMSDTS.text(),
					});

					// dbStartPage - Choose whether to run the Start Page or Inject the Integration
					if (dbStartPage) {

					} else {
						// If dbStartPage is disabled, inject the routes to allow the CMS to function
						integrationLogger(logger, verbose, 'info', 'Adding Page Routes...');
						injectRoute({
							pattern: "/",
							entrypoint: resolve('./pages-frontend/index.astro'),
						});
						injectRoute({
							pattern: '404',
							entrypoint: resolve('./pages-frontend/404.astro'),
						});
						injectRoute({
							pattern: 'about/',
							entrypoint: resolve('./pages-frontend/about.astro'),
						});
						injectRoute({
							pattern: 'blog/',
							entrypoint: resolve('./pages-frontend/blog/index.astro'),
						});
						injectRoute({
							pattern: 'blog/[slug]',
							entrypoint: resolve('./pages-frontend/blog/[...slug].astro'),
						});
						injectRoute({
							pattern: 'rss.xml',
							entrypoint: resolve('./pages-frontend/rss.xml.ts'),
						});
					}

					// Add Dashboard Integration
					addIntegration(params, {
						integration: studioCMSDashboard(options)
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
				'astro:server:start': ({ logger }) => {

					// Display Console Message if dbStartPage(First Time DB Initialization) is enabled
					if (options.dbStartPage) {
						integrationLogger(
							logger,
							true,
							'warn',
							DbErrors.DbStartPage
						);
					}
				},
			},
		};
	},
});

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
import { loadEnv } from 'vite';
import { integrationLogger } from './utils';
import { optionsSchema } from './schemas';
import inoxsitemap from '@inox-tools/sitemap-ext';
import studioCMSRobotsTXT from './integrations/robotstxt';
import studioCMSImageHandler from './integrations/imageHandler';
import { fileFactory } from './utils/fileFactory';

// Environment Variables
const env = loadEnv('all', process.cwd(), 'CMS');

const AUTHKEYS = {
	GITHUBCLIENTID: {
		N: 'CMS_GITHUB_CLIENT_ID',
		KEY:
			env.CMS_GITHUB_CLIENT_ID ||
			import.meta.env.CMS_GITHUB_CLIENT_ID ||
			process.env.CMS_GITHUB_CLIENT_ID,
	},
	GITHUBCLIENTSECRET: {
		N: 'CMS_GITHUB_CLIENT_SECRET',
		KEY:
			env.CMS_GITHUB_CLIENT_SECRET ||
			import.meta.env.CMS_GITHUB_CLIENT_SECRET ||
			process.env.CMS_GITHUB_CLIENT_SECRET,
	}
};

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
						addMiddleware,
						injectRoute,
						logger,
						command,
						config: { output, site, root },
					} = params;

					// Destructure Options
					const {
						verbose,
						dbStartPage,
						imageService: ImageServiceConfig,
						authConfig: { 
							mode: authMode 
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
						throw new AstroError("Astro Studio CMS is only supported in 'Output: server' SSR mode.");
					}

					// Check for Site URL
					if (!site) {
						throw new AstroError(
							"Astro Studio CMS requires a 'site' configuration in your Astro Config. This can be your domain ( 'https://example.com' ) or localhost ( 'http://localhost:4321' - localhost should only be used during development and should not be used in production)."
						);
					}

					// Setup Virtual Components

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
					};

					// Virtual Components
					const virtualComponentMap = `
					export { default as CImage } from '${virtResolver.CImage}';
					export { default as FormattedDate } from '${virtResolver.FormattedDate}';
					export { default as StudioCMSRenderer } from '${virtResolver.StudioCMSRenderer}';`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'virtual:studiocms/config': `export default ${JSON.stringify(options)}`,
							'studiocms:components': virtualComponentMap,
						},
					});

					// Create Virtual DTS File
					const studioCMSDTS = fileFactory();

					studioCMSDTS.addLines(`declare module 'studiocms:components' {
						export const CImage: typeof import('${virtResolver.CImage}').default;
						export const FormattedDate: typeof import('${virtResolver.FormattedDate}').default;
						export const StudioCMSRenderer: typeof import('${virtResolver.StudioCMSRenderer}').default;
					}`);

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: studioCMSDTS.text(),
					});

					// dbStartPage - Choose whether to run the Start Page or Inject the Integration
					if (dbStartPage) {
						integrationLogger(
							logger,
							true,
							'warn',
							'Start Page Enabled.  This will be the only page available until you initialize your database and disable the config option forcing this page to be displayed. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.'
						);
						injectRoute({
							pattern: 'start/',
							entrypoint: resolve('./pages-setup/start.astro'),
						});
						injectRoute({
							pattern: 'done/',
							entrypoint: resolve('./pages-setup/done.astro'),
						});
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

						// Authentication and Dashboard Setup
						// If Authentication is disabled it will disable the entire back-end dashboard allowing editing only via the Astro Studio Dashboard at https://studio.astro.build
						if (authMode === 'disable') {
							integrationLogger(
								logger,
								verbose,
								'warn',
								'Authentication Disabled. The ENTIRE Internal dashboard for the Astro Studio CMS is disabled. This means you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build'
							);
						} else if (authMode === 'built-in') {
							if (command === 'build') {
								// Check for Authenication Environment Variables
								if (!AUTHKEYS.GITHUBCLIENTID.KEY) {
									integrationLogger(logger, verbose, 'error', `In order to use the Built-in Github Authentication, you must set the ${AUTHKEYS.GITHUBCLIENTID.N} environment variable.`);
								}
								if (!AUTHKEYS.GITHUBCLIENTSECRET.KEY) {
									integrationLogger(logger, verbose, 'error', `In order to use the Built-in Github Authentication, you must set the ${AUTHKEYS.GITHUBCLIENTSECRET.N} environment variable.`);
								}
							}

							// Add Authentication Middleware
							integrationLogger(logger, verbose, 'info', 'Adding Authentication Middleware');
							addMiddleware({
								entrypoint: resolve('./middleware/index.ts'),
								order: 'pre',
							});
							// Add Dashboard Routes
							injectRoute({
								pattern: 'dashboard/',
								entrypoint: resolve('./pages-dashboard/index.astro'),
							});
							injectRoute({
								pattern: 'dashboard/profile/',
								entrypoint: resolve('./pages-dashboard/profile.astro'),
							});
							injectRoute({
								pattern: 'dashboard/new-post/',
								entrypoint: resolve('./pages-dashboard/new-post.astro'),
							});
							injectRoute({
								pattern: 'dashboard/post-list/',
								entrypoint: resolve('./pages-dashboard/post-list.astro'),
							});
							injectRoute({
								pattern: 'dashboard/site-config/',
								entrypoint: resolve('./pages-dashboard/site-config.astro'),
							});
							injectRoute({
								pattern: 'dashboard/admin-config/',
								entrypoint: resolve('./pages-dashboard/admin-config.astro'),
							});
							injectRoute({
								pattern: 'dashboard/login/',
								entrypoint: resolve('./pages-dashboard/login/index.astro'),
							});
							injectRoute({
								pattern: 'dashboard/edit/home/',
								entrypoint: resolve('./pages-dashboard/edit/home.astro'),
							});
							injectRoute({
								pattern: 'dashboard/edit/about/',
								entrypoint: resolve('./pages-dashboard/edit/about.astro'),
							});
							injectRoute({
								pattern: 'dashboard/edit/[...slug]',
								entrypoint: resolve('./pages-dashboard/edit/[...slug].astro'),
							});
							injectRoute({
								pattern: 'dashboard/delete/[...slug]',
								entrypoint: resolve('./pages-dashboard/delete/[...slug].astro'),
							});
							injectRoute({
								pattern: 'dashboard/login/github',
								entrypoint: resolve('./pages-dashboard/login/github/index.ts'),
							});
							injectRoute({
								pattern: 'dashboard/login/github/callback',
								entrypoint: resolve('./pages-dashboard/login/github/callback.ts'),
							});
							injectRoute({
								pattern: 'dashboard/logout',
								entrypoint: resolve('./pages-dashboard/logout.ts'),
							});
						} else if (authMode === 'plugin') {
							integrationLogger(
								logger,
								verbose,
								'warn',
								'Authentication Plugins are not supported. Please use the built-in Astro Studio CMS authentication. or Disable Authentication in your Astro Config, to manage your content via the Astro Studio Dashboard at http://studio.astro.build'
							);
						}
					}

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
								'No known robotstxt integration found. Adding `astro-robots` integration'
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
							addIntegration(params, { integration: inoxsitemap() });
						}
					}

					integrationLogger(logger, verbose, 'info', 'Astro Studio CMS Setup Complete!');
				},
				'astro:server:start': ({ logger }) => {

					// Display Console Message if dbStartPage(First Time DB Initialization) is enabled
					if (options.dbStartPage) {
						integrationLogger(
							logger,
							true,
							'warn',
							'Astro Studio CMS is running in Development Mode. To get started, visit http://localhost:4321/start in your browser to initialize your database. And Setup your installation.'
						);
					}
				},
			},
		};
	},
});

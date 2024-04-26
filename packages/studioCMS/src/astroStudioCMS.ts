import {
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
// import inoxsitemap from '@inox-tools/sitemap-ext';
import robotsTXT from './integrations/robotstxt';
import { optionsSchema } from './schemas';
import imageHandler from './integrations/imageHandler';

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
						config: { base, output, site },
					} = params;

					// Destructure Options
					const {
						verbose,
						dbStartPage,
						authConfig: { 
							mode: authMode 
						},
						includedIntegrations: { 
							useAstroRobots, 
							astroRobotsConfig 
						},
						imageService
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

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'virtual:astro-studio-cms:config': `export default ${JSON.stringify(options)}`,
						},
					});

					// dbStartPage - Choose whether to run the Start Page or Inject the Integration
					if (dbStartPage) {
						integrationLogger(
							logger,
							true,
							'warn',
							'Start Page Enabled.  This will be the only page available until you initialize your database. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.'
						);
						injectRoute({
							pattern: `${base}start/`,
							entrypoint: resolve('./pages/start.astro'),
						});
						injectRoute({
							pattern: `${base}done/`,
							entrypoint: resolve('./pages/done.astro'),
						});
					} else {
						// Add Page Routes
						integrationLogger(logger, verbose, 'info', 'Adding Page Routes...');
						injectRoute({
							pattern: base,
							entrypoint: resolve('./pages/index.astro'),
						});
						injectRoute({
							pattern: '404',
							entrypoint: resolve('./pages/404.astro'),
						});
						injectRoute({
							pattern: `${base}about/`,
							entrypoint: resolve('./pages/about.astro'),
						});
						injectRoute({
							pattern: `${base}blog/`,
							entrypoint: resolve('./pages/blog/index.astro'),
						});
						injectRoute({
							pattern: `${base}blog/[slug]`,
							entrypoint: resolve('./pages/blog/[...slug].astro'),
						});
						injectRoute({
							pattern: `${base}rss.xml`,
							entrypoint: resolve('./pages/rss.xml.ts'),
						});

						if (authMode === 'disable') {
							integrationLogger(
								logger,
								verbose,
								'warn',
								'Authentication Disabled. The ENTIRE Internal dashboard for the Astro Studio CMS is disabled. This means you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build'
							);
						} else if (authMode === 'built-in') {
							if (command === 'build') {
								// Check for Required Environment Variables
								if (!AUTHKEYS.GITHUBCLIENTID.KEY) {
									throw new AstroError(
										`Using the Built-in Authentication requires the ${AUTHKEYS.GITHUBCLIENTID.N} environment variable to be set. Please add this to your .env file.`
									);
								}
								if (!AUTHKEYS.GITHUBCLIENTSECRET.KEY) {
									throw new AstroError(
										`Using the Built-in Authentication requires the ${AUTHKEYS.GITHUBCLIENTSECRET.N} environment variable to be set. Please add this to your .env file.`
									);
								}
							}

							// Add Authentication Middleware
							integrationLogger(logger, verbose, 'info', 'Adding Authentication Middleware');
							addMiddleware({
								entrypoint: resolve('./middleware/index.ts'),
								order: 'pre',
							});
							injectRoute({
								pattern: `${base}dashboard/`,
								entrypoint: resolve('./pages/dashboard/index.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/profile/`,
								entrypoint: resolve('./pages/dashboard/profile.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/new-post/`,
								entrypoint: resolve('./pages/dashboard/new-post.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/post-list/`,
								entrypoint: resolve('./pages/dashboard/post-list.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/site-config/`,
								entrypoint: resolve('./pages/dashboard/site-config.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/admin-config/`,
								entrypoint: resolve('./pages/dashboard/admin-config.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/login/`,
								entrypoint: resolve('./pages/dashboard/login/index.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/edit/home/`,
								entrypoint: resolve('./pages/dashboard/edit/home.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/edit/about/`,
								entrypoint: resolve('./pages/dashboard/edit/about.astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/edit/[...slug]`,
								entrypoint: resolve('./pages/dashboard/edit/[...slug].astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/delete/[...slug]`,
								entrypoint: resolve('./pages/dashboard/delete/[...slug].astro'),
							});
							injectRoute({
								pattern: `${base}dashboard/login/github`,
								entrypoint: resolve('./pages/dashboard/login/github/index.ts'),
							});
							injectRoute({
								pattern: `${base}dashboard/login/github/callback`,
								entrypoint: resolve('./pages/dashboard/login/github/callback.ts'),
							});
							injectRoute({
								pattern: `${base}dashboard/logout`,
								entrypoint: resolve('./pages/dashboard/logout.ts'),
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

					// Add Image Service
					addIntegration(params, { 
						integration: imageHandler({
							ImageServiceConfig: imageService, 
							verbose
						})
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
								integration: robotsTXT({
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
					// if (useInoxSitemap) {
					// 	if (
					// 		!hasIntegration(params, { name: '@astrojs/sitemap' }) ||
					// 		!hasIntegration(params, { name: '@inox-tools/sitemap-ext' })
					// 	) {
					// 		integrationLogger(
					// 			logger,
					// 			verbose,
					// 			'info',
					// 			'No known sitemap integration found. Adding `@inox-tools/sitemap-ext` integration'
					// 		);
					// 		addIntegration(params, { integration: inoxsitemap() });
					// 	}
					// }

					integrationLogger(logger, verbose, 'info', 'Astro Studio CMS Setup Complete!');
				},
				'astro:server:start': ({ logger }) => {

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

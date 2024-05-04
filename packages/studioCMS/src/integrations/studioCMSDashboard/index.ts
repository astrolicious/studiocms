import { addDts, addIntegration, addVirtualImports, createResolver, defineIntegration } from "astro-integration-kit";
import { optionsSchema } from "../../schemas";
import { CheckENV, integrationLogger } from "../../utils";
import { loadEnv } from "vite";
import { fileFactory } from "../../utils/fileFactory";
import { DashboardStrings } from "../../strings";
import { presetTypography, presetWind, presetUno, transformerDirectives } from "unocss";
import UnoCSSAstroIntegration from "@unocss/astro";
import { presetDaisy } from "@yangyang20240403/unocss-preset-daisyui";

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

export default defineIntegration({
    name: 'astrolicious/studioCMS:adminDashboard',
    optionsSchema,
    setup({ name, options }) {
        return {
            hooks: {
                "astro:config:setup": ( params ) => {

                    // Destructure the params and options
                    const { 
						logger, 
						addMiddleware,
						injectRoute,
					} = params;

                    const { 
						verbose, 
						dbStartPage,
						dashboardConfig: { 
							dashboardEnabled,
							AuthConfig,
							AuthConfig: {
								providers,
							},
							developerConfig: {
								testingAndDemoMode
							},
						},
					} = options;

                    integrationLogger(logger, verbose, "info", "Dashboard Setup starting...");

                    // Check for Authenication Environment Variables
                    CheckENV(logger, verbose, AUTHKEYS);

					// Create Resolvers
					const { resolve } = createResolver(import.meta.url);

					// Virtual Resolver
					const virtResolver = { Auth: resolve('./lib/auth.ts'), };

					// Virtual Components
					const virtualComponentMap = `
					export * from '${virtResolver.Auth}';`;

					// Add Virtual Imports
					integrationLogger(logger, verbose, 'info', 'Adding Virtual Imports...');
					addVirtualImports(params, {
						name,
						imports: {
							'studiocms-dashboard:auth': virtualComponentMap,
						},
					});

					// Create Virtual DTS File
					const studioCMSDTS = fileFactory();

					studioCMSDTS.addLines(`declare module 'studiocms-dashboard:auth' {
                        export const lucia: typeof import('${virtResolver.Auth}').lucia;
					}`);

					// Add Virtual DTS File
					addDts(params, {
						name,
						content: studioCMSDTS.text(),
					});

					// In the case of First time Setup run the Start Pages
					if ( dbStartPage ) {
						injectRoute({
							pattern: 'start/',
							entrypoint: resolve('./routes/databaseSetup/start.astro'),
						});
						injectRoute({
							pattern: 'done/',
							entrypoint: resolve('./routes/databaseSetup/done.astro'),
						});
					}

					// Check if the Dashboard is enabled
					if ( dashboardEnabled && !dbStartPage ) {
						
						// Log that the Dashboard is enabled
						integrationLogger(logger, verbose, 'info', 'Dashboard is Enabled');

						// Add Dashboard Integrations
						integrationLogger(logger, verbose, 'info', 'Adding Dashboard Integrations');

						// CSS Management
						addIntegration(params, {
							integration: UnoCSSAstroIntegration({
								configFile: false,
								injectReset: false,
								injectEntry: false,
								presets: [
									presetUno(),
									presetDaisy({
										themes: ['light', 'dark'],
										darkTheme: 'dark',
									}),
									presetWind(), 
									presetTypography()
								],
								transformers: [
									transformerDirectives()
								],
							}),
						});

						// Setup the Dashboard Routes
						injectRoute({
							pattern: 'dashboard/',
							entrypoint: resolve('./routes/dashboard/pages/index.astro')
						})
						injectRoute({
							pattern: 'dashboard/profile/',
							entrypoint: resolve('./routes/dashboard/pages/profile.astro')
						})
						injectRoute({
							pattern: 'dashboard/configuration/',
							entrypoint: resolve('./routes/dashboard/pages/configuration/index.astro')
						})
						injectRoute({
							pattern: 'dashboard/configuration/admins/',
							entrypoint: resolve('./routes/dashboard/pages/configuration/admins.astro')
						})
						injectRoute({
							pattern: 'dashboard/new/post/',
							entrypoint: resolve('./routes/dashboard/pages/new/post.astro')
						})
						injectRoute({
							pattern: 'dashboard/post-list/',
							entrypoint: resolve('./routes/dashboard/pages/post-list.astro')
						})
						injectRoute({
							pattern: 'dashboard/page-list/',
							entrypoint: resolve('./routes/dashboard/pages/page-list.astro')
						})
						injectRoute({
							pattern: 'dashboard/edit/posts/[...slug]',
							entrypoint: resolve('./routes/dashboard/pages/edit/posts/[...slug].astro')
						})
						injectRoute({
							pattern: 'dashboard/delete/posts/[...slug]',
							entrypoint: resolve('./routes/dashboard/pages/delete/posts/[...slug].astro')
						})
						injectRoute({
							pattern: 'dashboard/edit/pages/[...slug]',
							entrypoint: resolve('./routes/dashboard/pages/edit/pages/[...slug].astro')
						})
						injectRoute({
							pattern: 'dashboard/delete/pages/[...slug]',
							entrypoint: resolve('./routes/dashboard/pages/delete/pages/[...slug].astro')
						})

						// Setup The Dashboard Authentication
						if ( AuthConfig.enabled ) {

							// Log that the Auth is enabled
							integrationLogger(logger, verbose, 'info', 'Auth is Enabled');

							// Add Middleware for Auth Session Handling
							integrationLogger(logger, verbose, 'info', 'Adding Middleware');
							addMiddleware({
								entrypoint: resolve('./middleware/index.ts'),
								order: 'pre',
							});

							integrationLogger(logger, verbose, 'info', 'Adding Auth Routes');

							// Inject Login and Logout Routes
							injectRoute({
								pattern: 'dashboard/login/',
								entrypoint: resolve('./routes/authroutes/login/index.astro'),
							})
							injectRoute({
								pattern: 'dashboard/logout/',
								entrypoint: resolve('./routes/authroutes/logout.ts'),
							})

							// GitHub Auth Provider
							if ( providers.github ) {
								// Log that the GitHub Auth Provider is enabled
								integrationLogger(logger, verbose, 'info', 'GitHub Auth Provider is Enabled');
								injectRoute({
									pattern: 'dashboard/login/github',
									entrypoint: resolve('./routes/authroutes/login/github/index.ts'),
								});
								injectRoute({
									pattern: 'dashboard/login/github/callback',
									entrypoint: resolve('./routes/authroutes/login/github/callback.ts'),
								});
							} else {
								// Log that the GitHub Auth Provider is disabled
								integrationLogger(logger, verbose, 'info', 'GitHub Auth Provider is Disabled');
							}

							// Username and Password Auth Provider
							// **NOT YET IMPLEMENTED**

						} else if ( testingAndDemoMode ) {
							
							// Log that the Auth is disabled
							integrationLogger(logger, verbose, 'info', DashboardStrings.TestAndDemo);
						} else if ( !AuthConfig.enabled ) {
							// Log that the Auth is disabled
							integrationLogger(logger, verbose, 'info', DashboardStrings.AuthDisabled);
						}

						// Log that the setup is complete
						integrationLogger(logger, verbose, "info", "Dashboard ready!");
						
					} else {
						// Log that the Dashboard is disabled
						integrationLogger(logger, verbose, 'info', DashboardStrings.DashboardDisabled);
					}


                }
            }
        }
}});
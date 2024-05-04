import { addDts, addVirtualImports, createResolver, defineIntegration } from "astro-integration-kit";
import { optionsSchema } from "../../schemas";
import { CheckENV, integrationLogger } from "../../utils";
import { loadEnv } from "vite";
import { fileFactory } from "../../utils/fileFactory";

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
						integrationLogger(
							logger,
							true,
							'warn',
							'Start Page Enabled.  This will be the only page available until you initialize your database and disable the config option forcing this page to be displayed. To get started, visit http://localhost:4321/start/ in your browser to initialize your database. And Setup your installation.'
						);
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

						// Setup the Dashboard Routes

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
							integrationLogger(logger, verbose, 'info', 'Testing and Demo Mode is Enabled, Authentication will not be required for dashboard pages.  But you will only be able to edit the database from the Astro Studio Dashboard, https://studio.astro.build/');
						} else if ( !AuthConfig.enabled ) {
							// Log that the Auth is disabled
							integrationLogger(logger, verbose, 'info', 'Auth is Disabled by the User Configuration.  You will only be able to edit the database from the Astro Studio Dashboard, https://studio.astro.build/');
						}

						// Log that the setup is complete
						integrationLogger(logger, verbose, "info", "Dashboard ready!");
						
					} else {
						// Log that the Dashboard is disabled
						integrationLogger(logger, verbose, 'info', 'Dashboard is Disabled, Some tools and Utilities are still available for developers who are customizing their setup!');
					}


                }
            }
        }
}});
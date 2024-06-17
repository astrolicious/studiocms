import { addIntegration, createResolver, defineIntegration } from "astro-integration-kit";
import { injectAuthRouteArray, injectRouteArray, virtualResolver, loadKeys, studioLogger, studioLoggerOptsResolver } from "./utils";
import { optionsSchema } from "./schemas";
import { AuthProviderLogStrings, DashboardStrings, DbErrors } from "./strings";
import { astroENV } from "./env";
import { FileSystemIconLoader, studioCMSUnoCSSIntegration } from "./studiocsspreset";
import { usernameAndPasswordAuthConfig } from "./studioauth-config";

export default defineIntegration({
    name: '@astrolicious/studioCMS:adminDashboard',
    optionsSchema,
    setup({ name, options }) {
        return {
            hooks: {
                "astro:config:setup": async ( params ) => {

                    // Destructure the params and options
                    const { 
						logger,
						addMiddleware,
						updateConfig,
					} = params;

                    const { 
						verbose, 
						dbStartPage,
						dashboardConfig: { 
							dashboardEnabled,
							AuthConfig,
							dashboardRouteOverride,
							AuthConfig: {
								providers,
								providers: {
									usernameAndPasswordConfig: {
										allowUserRegistration
									},
									github,
									discord,
									google,
									auth0,
									usernameAndPassword
								}
							},
							developerConfig: {
								testingAndDemoMode
							},
						},
					} = options;

					const LoggerOpts = await studioLoggerOptsResolver(logger, verbose);

					studioLogger(LoggerOpts.logInfo, DashboardStrings.Setup);

                    // Check for Authenication Environment Variables
					loadKeys(logger, verbose, providers);

					updateConfig({
						experimental: {
							env: astroENV,
						}
					})

					// Create Resolvers
					const { resolve } = createResolver(import.meta.url);

					virtualResolver(params, { name });

					// Add Dashboard Integrations
					studioLogger(LoggerOpts.logInfo, DashboardStrings.AddIntegrations);

					// CSS Management
					addIntegration(params, { integration: studioCMSUnoCSSIntegration({
						options,
						icons: {
							collections: {
								mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
								google: FileSystemIconLoader(resolve('./icons/google')),
								discord: FileSystemIconLoader(resolve('./icons/discord')),
								github: FileSystemIconLoader(resolve('./icons/github')),
								auth0: FileSystemIconLoader(resolve('./icons/auth0')),
							},
						}
					})});

					// In the case of First time Setup run the Start Pages
					if ( dbStartPage ) {
						injectRouteArray(params, {
							routes: [
								{ pattern: 'start/', 
									entrypoint: resolve('./routes/databaseSetup/main.astro'),
								    _non_dashboard: true
								}, { 
									pattern: 'api/setup', 
									entrypoint: resolve('./routes/databaseSetup/setup.ts'),
									_non_dashboard: true
								}, { 
									pattern: 'done/', 
									entrypoint: resolve('./routes/databaseSetup/done.astro'),
									_non_dashboard: true
								} ]
						})
					}


					// Check if the Dashboard is enabled
					if ( dashboardEnabled && !dbStartPage ) {
						// Log that the Dashboard is enabled
						studioLogger(LoggerOpts.logInfo, DashboardStrings.DashboardEnabled);

						injectRouteArray(params, {
							dashboardRouteOverride,
							routes: [
								{ 
									pattern: 'api/liverender', 
									entrypoint: resolve('./routes/dashboard/partials/LivePreview.astro') 
								}, {
									pattern: '/',
									entrypoint: resolve('./routes/dashboard/pages/index.astro')
								}, {
									pattern: 'profile/',
									entrypoint: resolve('./routes/dashboard/pages/profile.astro')
								}, {
									pattern: 'configuration/',
									entrypoint: resolve('./routes/dashboard/pages/configuration/index.astro')
								}, {
									pattern: 'configuration/admins/',
									entrypoint: resolve('./routes/dashboard/pages/configuration/admins.astro')
								}, {
									pattern: 'new/page/',
									entrypoint: resolve('./routes/dashboard/pages/new/page.astro')
								}, {
									pattern: 'page-list/',
									entrypoint: resolve('./routes/dashboard/pages/edit/page-list.astro')
								}, {
									pattern: 'edit/pages/[...slug]',
									entrypoint: resolve('./routes/dashboard/pages/edit/pages/[...slug].astro')
								}, {
									pattern: 'delete/pages/[...slug]',
									entrypoint: resolve('./routes/dashboard/pages/delete/pages/[...slug].astro')
								}
							]
						});

						// Setup The Dashboard Authentication
						if ( AuthConfig.enabled ) {
							if ( testingAndDemoMode ) {
								// Log that the Auth is bypassed in Test and Demo Mode
								studioLogger(LoggerOpts.logInfo, DashboardStrings.TestAndDemo);
							}

							// Log that the Auth is enabled
							studioLogger(LoggerOpts.logInfo, DashboardStrings.AuthEnabled);

							// Add Middleware for Auth Session Handling
							studioLogger(LoggerOpts.logInfo, DashboardStrings.Middleware);
							addMiddleware({
								entrypoint: resolve('./middleware/index.ts'),
								order: 'pre',
							});

							studioLogger(LoggerOpts.logInfo, DashboardStrings.AuthRoutes);

							// Inject Login and Logout Routes
							injectRouteArray(params, {
								dashboardRouteOverride,
								routes: [
									{ 
										pattern: 'login/',
										entrypoint: resolve('./routes/authroutes/login/index.astro')
									}, {
										pattern: 'logout/',
										entrypoint: resolve('./routes/authroutes/logout.ts')
									}
								]
							})

							// Inject Auth Provider Routes
							injectAuthRouteArray(params, {
								dashboardRouteOverride,
								LoggerOpts,
								providerRoutes: [
									{
										enabled: github,
										logs: AuthProviderLogStrings.githubLogs,
										routes: [
											{
												pattern: 'login/github',
												entrypoint: resolve('./routes/authroutes/login/github/index.ts'),
											}, {
												pattern: 'login/github/callback',
												entrypoint: resolve('./routes/authroutes/login/github/callback.ts'),
											}
										]
									}, {
										enabled: discord,
										logs: AuthProviderLogStrings.discordLogs,
										routes: [
											{
												pattern: 'login/discord',
												entrypoint: resolve('./routes/authroutes/login/discord/index.ts'),
											}, {
												pattern: 'login/discord/callback',
												entrypoint: resolve('./routes/authroutes/login/discord/callback.ts'),
											}
										]
									}, {
										enabled: google,
										logs: AuthProviderLogStrings.googleLogs,
										routes: [
											{
												pattern: 'login/google',
												entrypoint: resolve('./routes/authroutes/login/google/index.ts'),
											}, {
												pattern: 'login/google/callback',
												entrypoint: resolve('./routes/authroutes/login/google/callback.ts'),
											}
										]
									}, {
										enabled: auth0,
										logs: AuthProviderLogStrings.auth0Logs,
										routes: [
											{
												pattern: 'login/auth0',
												entrypoint: resolve('./routes/authroutes/login/auth0/index.ts'),
											}, {
												pattern: 'login/auth0/callback',
												entrypoint: resolve('./routes/authroutes/login/auth0/callback.ts'),
											}
										]
									}, {
										enabled: usernameAndPassword,
										logs: AuthProviderLogStrings.usernameAndPasswordLogs,
										routes: [
											{
												pattern: 'login/api/login',
												entrypoint: resolve('./routes/authroutes/login/api/login.ts'),
											}
										]
									}, {
										enabled: usernameAndPassword && allowUserRegistration,
										logs: AuthProviderLogStrings.allowUserRegistration,
										routes: [
											{
												pattern: 'signup/',
												entrypoint: resolve('./routes/authroutes/login/signup.astro'),
											}, {
												pattern: 'login/api/register',
												entrypoint: resolve('./routes/authroutes/login/api/register.ts'),
											}
										]
									}
								]
							})

							// If Username and Password Auth is enabled Verify the Auth Config File Exists and is setup!
							usernameAndPasswordAuthConfig(params, { 
								enabled: usernameAndPassword, 
								name 
							});

						} else if ( !AuthConfig.enabled ) {
							// Log that the Auth is disabled
							studioLogger(LoggerOpts.logInfo, DashboardStrings.AuthDisabled);
						}

						// Log that the setup is complete
						studioLogger(LoggerOpts.logInfo, DashboardStrings.SetupComplete);
						
					} else {
						// Log that the Dashboard is disabled
						studioLogger(LoggerOpts.logInfo, DashboardStrings.DashboardDisabled);
					}


                },
				'astro:server:start': async ({ logger }) => {
					// Display Console Message if dbStartPage(First Time DB Initialization) is enabled
					const { logWarn } = await studioLoggerOptsResolver(logger, true);
					if (options.dbStartPage) { 
						studioLogger(logWarn, DbErrors.DbStartPage);
					}
				},
            }
        }
}});
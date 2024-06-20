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

		// Create Resolvers
		const { resolve } = createResolver(import.meta.url);

        return {
            hooks: {
                "astro:config:setup": async ( params ) => {

					// Logger Options
					const LoggerOpts = await studioLoggerOptsResolver(params.logger, options.verbose);

					// Log that the setup has started
					studioLogger(LoggerOpts.logInfo, DashboardStrings.Setup);

                    // Check for Authenication Environment Variables
					loadKeys(params.logger, options);

					// Update Astro Config with Environment Variables (`astro:env`)
					params.updateConfig({ experimental: { env: astroENV } });

					// Virtual Imports and DTS File Creation
					virtualResolver(params, { name });

					// Add Dashboard Integrations
					studioLogger(LoggerOpts.logInfo, DashboardStrings.AddIntegrations);

					// CSS Management
					addIntegration(params, { 
						integration: studioCMSUnoCSSIntegration({
							options, 
							icons: { 
								collections: {
									logos: () => import('@iconify-json/logos/icons.json').then(i => i.default),
									mdi: () => import('@iconify-json/mdi/icons.json').then(i => i.default),
									google: FileSystemIconLoader(resolve('./icons/google')),
									discord: FileSystemIconLoader(resolve('./icons/discord')),
									github: FileSystemIconLoader(resolve('./icons/github')),
									auth0: FileSystemIconLoader(resolve('./icons/auth0')),
							}}
						})
					});

					// Inject Routes
					injectRouteArray(params, {
						options,
						routes: [
							{ 
								enabled: options.dbStartPage,
								pattern: 'start/', 
								entrypoint: resolve('./routes/databaseSetup/main.astro'),
								_non_dashboard: true
							}, { 
								enabled: options.dbStartPage,
								pattern: 'api/setup', 
								entrypoint: resolve('./routes/databaseSetup/setup.ts'),
								_non_dashboard: true
							}, { 
								enabled: options.dbStartPage,
								pattern: 'done/', 
								entrypoint: resolve('./routes/databaseSetup/done.astro'),
								_non_dashboard: true
							}, { 
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'api/liverender', 
								entrypoint: resolve('./routes/dashboard/partials/LivePreview.astro') 
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: '/',
								entrypoint: resolve('./routes/dashboard/pages/index.astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'profile/',
								entrypoint: resolve('./routes/dashboard/pages/profile.astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'configuration/',
								entrypoint: resolve('./routes/dashboard/pages/configuration/index.astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'configuration/admins/',
								entrypoint: resolve('./routes/dashboard/pages/configuration/admins.astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'new/page/',
								entrypoint: resolve('./routes/dashboard/pages/new/page.astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'page-list/',
								entrypoint: resolve('./routes/dashboard/pages/edit/page-list.astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'edit/pages/[...slug]',
								entrypoint: resolve('./routes/dashboard/pages/edit/pages/[...slug].astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'delete/pages/[...slug]',
								entrypoint: resolve('./routes/dashboard/pages/delete/pages/[...slug].astro')
							}, { 
								enabled: options.dashboardConfig.dashboardEnabled && 
									!options.dbStartPage && 
									options.dashboardConfig.AuthConfig.enabled,
								pattern: 'login/',
								entrypoint: resolve('./routes/authroutes/login/index.astro')
							}, {
								enabled: options.dashboardConfig.dashboardEnabled && 
									!options.dbStartPage && 
									options.dashboardConfig.AuthConfig.enabled,
								pattern: 'logout/',
								entrypoint: resolve('./routes/authroutes/logout.ts')
							}
						]
					});

					// Setup The Dashboard Authentication Routes
					injectAuthRouteArray(params, {
						options, LoggerOpts,
						middleware: resolve('./middleware/index.ts'),
						providerRoutes: [
							{
								enabled: options.dashboardConfig.AuthConfig.providers.github,
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
								enabled: options.dashboardConfig.AuthConfig.providers.discord,
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
								enabled: options.dashboardConfig.AuthConfig.providers.google,
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
								enabled: options.dashboardConfig.AuthConfig.providers.auth0,
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
								enabled: options.dashboardConfig.AuthConfig.providers.usernameAndPassword,
								logs: AuthProviderLogStrings.usernameAndPasswordLogs,
								routes: [
									{
										pattern: 'login/api/login',
										entrypoint: resolve('./routes/authroutes/login/api/login.ts'),
									}
								]
							}, {
								enabled: options.dashboardConfig.AuthConfig.providers.usernameAndPassword && 
									options.dashboardConfig.AuthConfig.providers.usernameAndPasswordConfig.allowUserRegistration,
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
					});

					// If Username and Password Auth is enabled Verify the Auth Config File Exists and is setup!
					usernameAndPasswordAuthConfig(params, { options, name });

					// Log that the setup is complete
					studioLogger(LoggerOpts.logInfo, DashboardStrings.SetupComplete);

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
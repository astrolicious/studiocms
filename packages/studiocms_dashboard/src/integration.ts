import astrolace from '@matthiesenxyz/astrolace';
import { addIntegrationArray } from '@matthiesenxyz/integration-utils/aikUtils';
import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import studioCMSAuth from '@studiocms/auth';
import { DashboardStrings, DbErrors, StudioCMSOptionsSchema } from '@studiocms/core';
import { createResolver, defineIntegration } from 'astro-integration-kit';
import UnocssAstroIntegration from 'unocss/astro';
import { checkForWebVitals } from './utils/checkForWebVitalsPlugin';
import { injectRouteArray } from './utils/injectRouteArray';

export default defineIntegration({
	name: '@studiocms/dashboard',
	optionsSchema: StudioCMSOptionsSchema,
	setup({
		name,
		options,
		options: {
			verbose,
			dbStartPage,
			dashboardConfig: { UnoCSSConfigOverride },
		},
	}) {
		const { resolve } = createResolver(import.meta.url);

		let WEBVITALSDTSFILE: string;

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					// Destructure Params
					const { logger } = params;
					// Log that the setup has started
					integrationLogger({ logger, logLevel: 'info', verbose }, DashboardStrings.Setup);

					// Add Dashboard Integrations
					integrationLogger(
						{ logger, logLevel: 'info', verbose },
						DashboardStrings.AddIntegrations
					);
					addIntegrationArray(params, [
						// Add Shoelace.style Integration for the Dashboard
						{ integration: astrolace({ verbose, injectCss: false }) },
						// Add Auth Integration for the Dashboard
						{ integration: studioCMSAuth(options) },
						// Add UnoCSS Integration for the Dashboard
						{
							integration: UnocssAstroIntegration({
								configFile: resolve('./unocss.config.ts'),
								injectReset: UnoCSSConfigOverride.injectReset,
								injectEntry: UnoCSSConfigOverride.injectEntry,
							}),
						},
					]);

					// Inject Routes
					injectRouteArray(params, {
						options,
						routes: [
							{
								enabled: options.dbStartPage,
								pattern: 'start/',
								entrypoint: resolve('./firstTimeSetupRoutes/main.astro'),
								_non_dashboard: true,
							},
							{
								enabled: options.dbStartPage,
								pattern: 'done/',
								entrypoint: resolve('./firstTimeSetupRoutes/done.astro'),
								_non_dashboard: true,
							},
							{
								enabled: options.dbStartPage,
								pattern: 'api/setup',
								entrypoint: resolve('./routes/api/firstTimeSetup.ts'),
								_non_dashboard: true,
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: '/',
								entrypoint: resolve('./routes/index.astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'profile/',
								entrypoint: resolve('./routes/profile.astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'configuration/',
								entrypoint: resolve('./routes/configuration/index.astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'configuration/admins/',
								entrypoint: resolve('./routes/configuration/admins.astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'new/page/',
								entrypoint: resolve('./routes/create-page.astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'page-list/',
								entrypoint: resolve('./routes/page-list.astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'edit/pages/[...id]',
								entrypoint: resolve('./routes/edit-pages/[...id].astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'delete/pages/[...id]',
								entrypoint: resolve('./routes/delete-pages/[...id].astro'),
							},
							{
								enabled: options.dashboardConfig.dashboardEnabled && !options.dbStartPage,
								pattern: 'api/liverender',
								entrypoint: resolve('./routes/api/LiveRender.astro'),
							},
							{
								enabled:
									options.dashboardConfig.dashboardEnabled &&
									!options.dbStartPage &&
									options.dashboardConfig.AuthConfig.enabled,
								pattern: 'api/config/site',
								entrypoint: resolve('./routes/api/config/site.ts'),
							},
							{
								enabled:
									options.dashboardConfig.dashboardEnabled &&
									!options.dbStartPage &&
									options.dashboardConfig.AuthConfig.enabled,
								pattern: 'api/config/admin',
								entrypoint: resolve('./routes/api/config/admin.ts'),
							},
							{
								enabled:
									options.dashboardConfig.dashboardEnabled &&
									!options.dbStartPage &&
									options.dashboardConfig.AuthConfig.enabled,
								pattern: 'api/pages/create',
								entrypoint: resolve('./routes/api/pages/create.ts'),
							},
							{
								enabled:
									options.dashboardConfig.dashboardEnabled &&
									!options.dbStartPage &&
									options.dashboardConfig.AuthConfig.enabled,
								pattern: 'api/pages/edit',
								entrypoint: resolve('./routes/api/pages/edit.ts'),
							},
							{
								enabled:
									options.dashboardConfig.dashboardEnabled &&
									!options.dbStartPage &&
									options.dashboardConfig.AuthConfig.enabled,
								pattern: 'api/pages/delete',
								entrypoint: resolve('./routes/api/pages/delete.ts'),
							},
						],
					});

					// Check for `@astrojs/web-vitals` Integration
					const { webVitalDtsFile } = checkForWebVitals(params, { name, verbose });

					// Set the Web Vitals DTS File
					WEBVITALSDTSFILE = webVitalDtsFile;

					// Log that the setup is complete
					integrationLogger({ logger, logLevel: 'info', verbose }, DashboardStrings.SetupComplete);
				},
				'astro:config:done': async ({ injectTypes }) => {
					// Inject the Web Vitals DTS File
					injectTypes({
						filename: 'web-vitals.d.ts',
						content: WEBVITALSDTSFILE,
					});
				},
				'astro:server:start': async ({ logger }) => {
					// Display Console Message if dbStartPage(First Time DB Initialization) is enabled
					if (dbStartPage) {
						integrationLogger({ logger, logLevel: 'warn', verbose: true }, DbErrors.DbStartPage);
					}
				},
			},
		};
	},
});

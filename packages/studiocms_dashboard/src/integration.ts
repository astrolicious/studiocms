import { runtimeLogger } from '@inox-tools/runtime-logger';
import astrolace from '@matthiesenxyz/astrolace';
import { addIntegrationArray } from '@matthiesenxyz/integration-utils/aikUtils';
import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { presetDaisy } from '@matthiesenxyz/unocss-preset-daisyui';
import studioCMSAuth from '@studiocms/auth';
import { StudioCMSOptionsSchema as optionsSchema } from '@studiocms/core/schemas';
import { DashboardStrings, DbErrors } from '@studiocms/core/strings';
import { createResolver, defineIntegration } from 'astro-integration-kit';
import {
	presetTypography,
	presetUno,
	presetWebFonts,
	presetWind,
	transformerDirectives,
} from 'unocss';
import UnocssAstroIntegration from 'unocss/astro';
import type { DarkModeSelectors } from 'unocss/preset-mini';
import { name } from '../package.json';
import { checkForWebVitals } from './utils/checkForWebVitalsPlugin';
import { injectRouteArray } from './utils/injectRouteArray';

const darkModeSelector: DarkModeSelectors = {
	dark: '[data-theme="dark"]',
};

export default defineIntegration({
	name,
	optionsSchema,
	setup({ name, options }) {
		// Create resolver relative to this file
		const { resolve } = createResolver(import.meta.url);

		// Declaration for Web Vitals DTS File
		let WEBVITALSDTSFILE: string;

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					// Destructure Params
					const { logger } = params;

					// Destructure Options
					const {
						verbose,
						dashboardConfig: { UnoCSSConfigOverride },
					} = options;

					// Log that the setup has started
					integrationLogger({ logger, logLevel: 'info', verbose }, DashboardStrings.Setup);

					// Inject `@it-astro:logger:{name}` Logger for runtime logging
					runtimeLogger(params, { name: 'studiocms-dashboard' });

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
								configFile: false,
								injectReset: UnoCSSConfigOverride.injectReset,
								injectEntry: UnoCSSConfigOverride.injectEntry,
								transformers: [transformerDirectives()],
								presets: [
									presetUno({
										dark: darkModeSelector,
									}),
									presetWind({
										dark: darkModeSelector,
									}),
									presetDaisy({
										themes: ['light', 'dark'],
										darkTheme: 'dark',
									}),
									presetTypography(),
									presetWebFonts({
										provider: 'google',
										fonts: {
											// Required Fonts for Google Icons
											sans: 'Roboto',
											mono: ['Fira Code', 'Fira Mono:400,700'],
										},
									}),
								],
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
					if (options.dbStartPage) {
						integrationLogger({ logger, logLevel: 'warn', verbose: true }, DbErrors.DbStartPage);
					}
				},
			},
		};
	},
});

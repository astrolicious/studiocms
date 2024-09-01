import { runtimeLogger } from '@inox-tools/runtime-logger';
import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import {
	AuthProviderLogStrings,
	DashboardStrings,
	addAstroEnvConfig,
	StudioCMSOptionsSchema as optionsSchema,
} from '@studiocms/core';
import { createResolver, defineIntegration } from 'astro-integration-kit';
import { name } from '../package.json';
import { astroENV } from './astroenv/env';
import authconfig from './stubs/auth-config';
import { checkEnvKeys } from './utils/checkENV';
import { injectAuthRouteArray } from './utils/injectAuthRoutes';
import { usernameAndPasswordAuthConfig } from './utils/studioauth-config';

export default defineIntegration({
	name,
	optionsSchema,
	setup({ name, options }) {
		// Create resolver relative to this file
		const { resolve } = createResolver(import.meta.url);

		return {
			hooks: {
				'astro:config:setup': async (params) => {
					// Destructure Params
					const { logger } = params;

					// Log that Setup is Starting
					integrationLogger(
						{ logger, logLevel: 'info', verbose: options.verbose },
						DashboardStrings.Setup
					);

					// Inject `@it-astro:logger:{name}` Logger for runtime logging
					runtimeLogger(params, { name: 'studiocms-auth' });

					// Check for Authentication Environment Variables
					checkEnvKeys(logger, options);

					// Update Astro Config with Environment Variables (`astro:env`)
					addAstroEnvConfig(params, astroENV);

					// If Username and Password Auth is enabled Verify the Auth Config File Exists and is setup!
					usernameAndPasswordAuthConfig(params, { options, name });

					// Inject Routes
					injectAuthRouteArray(params, {
						options,

						middleware: resolve('./middleware/index.ts'),
						providerRoutes: [
							{
								enabled: options.dashboardConfig.AuthConfig.providers.github,
								logs: AuthProviderLogStrings.githubLogs,
								routes: [
									{
										pattern: 'login/github',
										entrypoint: resolve('./routes/login/github/index.ts'),
									},
									{
										pattern: 'login/github/callback',
										entrypoint: resolve('./routes/login/github/callback.ts'),
									},
								],
							},
							{
								enabled: options.dashboardConfig.AuthConfig.providers.discord,
								logs: AuthProviderLogStrings.discordLogs,
								routes: [
									{
										pattern: 'login/discord',
										entrypoint: resolve('./routes/login/discord/index.ts'),
									},
									{
										pattern: 'login/discord/callback',
										entrypoint: resolve('./routes/login/discord/callback.ts'),
									},
								],
							},
							{
								enabled: options.dashboardConfig.AuthConfig.providers.google,
								logs: AuthProviderLogStrings.googleLogs,
								routes: [
									{
										pattern: 'login/google',
										entrypoint: resolve('./routes/login/google/index.ts'),
									},
									{
										pattern: 'login/google/callback',
										entrypoint: resolve('./routes/login/google/callback.ts'),
									},
								],
							},
							{
								enabled: options.dashboardConfig.AuthConfig.providers.auth0,
								logs: AuthProviderLogStrings.auth0Logs,
								routes: [
									{
										pattern: 'login/auth0',
										entrypoint: resolve('./routes/login/auth0/index.ts'),
									},
									{
										pattern: 'login/auth0/callback',
										entrypoint: resolve('./routes/login/auth0/callback.ts'),
									},
								],
							},
							{
								enabled: options.dashboardConfig.AuthConfig.providers.usernameAndPassword,
								logs: AuthProviderLogStrings.usernameAndPasswordLogs,
								routes: [
									{
										pattern: 'login/api/login',
										entrypoint: resolve('./routes/login/api/login.ts'),
									},
								],
							},
							{
								enabled:
									options.dashboardConfig.AuthConfig.providers.usernameAndPassword &&
									options.dashboardConfig.AuthConfig.providers.usernameAndPasswordConfig
										.allowUserRegistration,
								logs: AuthProviderLogStrings.allowUserRegistration,
								routes: [
									{
										pattern: 'signup/',
										entrypoint: resolve('./routes/login/signup.astro'),
									},
									{
										pattern: 'login/api/register',
										entrypoint: resolve('./routes/login/api/register.ts'),
									},
								],
							},
							{
								enabled:
									options.dashboardConfig.dashboardEnabled &&
									!options.dbStartPage &&
									options.dashboardConfig.AuthConfig.enabled,
								logs: {
									enabledMessage: 'Auth Enabled, Injecting Login and Logout Pages',
									disabledMessage: 'Auth Disabled',
								},
								routes: [
									{
										pattern: 'login/',
										entrypoint: resolve('./routes/login/index.astro'),
									},
									{
										pattern: 'logout/',
										entrypoint: resolve('./routes/logout.ts'),
									},
								],
							},
						],
					});
				},
				'astro:config:done': async ({ injectTypes }) => {
					// Inject Types
					injectTypes({
						filename: 'auth-config.d.ts',
						content: authconfig,
					});
				},
			},
		};
	},
});

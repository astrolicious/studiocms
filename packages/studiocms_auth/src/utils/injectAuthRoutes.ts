import { integrationLogger } from '@matthiesenxyz/integration-utils/astroUtils';
import { DashboardStrings, type StudioCMSOptions } from '@studiocms/core';
import { defineUtility } from 'astro-integration-kit';

export const injectAuthRouteArray = defineUtility('astro:config:setup')(
	(
		params,
		opts: {
			options: StudioCMSOptions;
			middleware: string;
			providerRoutes: {
				enabled: boolean;
				logs: {
					enabledMessage: string;
					disabledMessage: string;
				};
				routes: {
					pattern: string;
					entrypoint: string;
				}[];
			}[];
		}
	) => {
		const { injectRoute, addMiddleware, logger } = params;
		const {
			options: {
				dashboardConfig: {
					dashboardEnabled,
					dashboardRouteOverride,
					developerConfig: { testingAndDemoMode },
					AuthConfig: { enabled },
				},
				dbStartPage,
			},
			options,
		} = opts;

		const { middleware, providerRoutes } = opts;

		if (dashboardEnabled && !dbStartPage) {
			// Log that the Dashboard is enabled
			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				DashboardStrings.DashboardEnabled
			);
		} else {
			// Log that the Dashboard is disabled
			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				DashboardStrings.DashboardDisabled
			);
		}

		if (enabled) {
			// Log that the Auth is enabled
			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				DashboardStrings.AuthEnabled
			);

			// If Testing and Demo Mode is enabled, log that it is enabled
			if (testingAndDemoMode) {
				integrationLogger(
					{ logger, logLevel: 'info', verbose: options.verbose },
					DashboardStrings.TestAndDemo
				);
			}

			// Add Middleware for Auth Session Handling
			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				DashboardStrings.Middleware
			);
			addMiddleware({
				entrypoint: middleware,
				order: 'pre',
			});

			// Make the Default Dashboard Route
			const defaultDashboardRoute = dashboardRouteOverride
				? dashboardRouteOverride.replace(/^\//, '')
				: 'dashboard';

			// Utility Function to Make a Dashboard Route
			const makeDashboardRoute = (path: string) => {
				return `${defaultDashboardRoute}/${path}`;
			};

			// Log that the Auth Routes are being injected
			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				DashboardStrings.AuthRoutes
			);

			// Inject Auth Provider Routes
			for (const provider of providerRoutes) {
				const { enabled, logs, routes } = provider;

				if (enabled) {
					const { enabledMessage } = logs;

					integrationLogger({ logger, logLevel: 'info', verbose: options.verbose }, enabledMessage);

					for (const route of routes) {
						const { pattern, entrypoint } = route;

						injectRoute({
							pattern: makeDashboardRoute(pattern),
							entrypoint,
						});
					}
				}
			}
		} else if (!enabled) {
			integrationLogger(
				{ logger, logLevel: 'info', verbose: options.verbose },
				DashboardStrings.AuthDisabled
			);
		}
	}
);

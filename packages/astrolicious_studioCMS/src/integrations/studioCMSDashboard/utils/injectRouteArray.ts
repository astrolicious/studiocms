import { defineUtility } from 'astro-integration-kit';
import { type StudioLoggerOptsResolverResponse, studioLogger } from '../../../utils';
import type { StudioCMSOptions } from '../schemas';
import { DashboardStrings } from '../strings';

export const injectRouteArray = defineUtility('astro:config:setup')(
	(
		params,
		opts: {
			options: StudioCMSOptions;
			routes: {
				enabled: boolean;
				pattern: string;
				entrypoint: string;
				_non_dashboard?: boolean;
			}[];
		}
	) => {
		const { injectRoute } = params;

		const {
			options: {
				dashboardConfig: { dashboardRouteOverride },
			},
			routes,
		} = opts;

		const defaultDashboardRoute = dashboardRouteOverride
			? dashboardRouteOverride.replace(/^\//, '')
			: 'dashboard';

		const makeDashboardRoute = (path: string) => {
			return `${defaultDashboardRoute}/${path}`;
		};

		for (const route of routes) {
			const { enabled, _non_dashboard, pattern, entrypoint } = route;

			if (enabled) {
				if (_non_dashboard) {
					injectRoute({
						pattern,
						entrypoint,
					});
				} else {
					injectRoute({
						pattern: makeDashboardRoute(pattern),
						entrypoint,
					});
				}
			}
		}
	}
);

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
			LoggerOpts: StudioLoggerOptsResolverResponse;
		}
	) => {
		const { injectRoute, addMiddleware } = params;
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
		} = opts;

		const {
			middleware,
			providerRoutes,
			LoggerOpts: { logInfo },
		} = opts;

		if (dashboardEnabled && !dbStartPage) {
			// Log that the Dashboard is enabled
			studioLogger(logInfo, DashboardStrings.DashboardEnabled);
		} else {
			// Log that the Dashboard is disabled
			studioLogger(logInfo, DashboardStrings.DashboardDisabled);
		}

		if (enabled) {
			// Log that the Auth is enabled
			studioLogger(logInfo, DashboardStrings.AuthEnabled);

			// If Testing and Demo Mode is enabled, log that it is enabled
			if (testingAndDemoMode) {
				studioLogger(logInfo, DashboardStrings.TestAndDemo);
			}

			// Add Middleware for Auth Session Handling
			studioLogger(logInfo, DashboardStrings.Middleware);
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
			studioLogger(logInfo, DashboardStrings.AuthRoutes);

			// Inject Auth Provider Routes
			for (const provider of providerRoutes) {
				const { enabled, logs, routes } = provider;

				if (enabled) {
					const { enabledMessage } = logs;

					studioLogger(logInfo, enabledMessage);

					for (const route of routes) {
						const { pattern, entrypoint } = route;

						injectRoute({
							pattern: makeDashboardRoute(pattern),
							entrypoint,
						});
					}
				} else {
					const { disabledMessage } = logs;

					studioLogger(logInfo, disabledMessage);
				}
			}
		} else if (!enabled) {
			studioLogger(logInfo, DashboardStrings.AuthDisabled);
		}
	}
);

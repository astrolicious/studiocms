import type { StudioCMSOptions } from '@studiocms/core/schemas';
import { defineUtility } from 'astro-integration-kit';

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

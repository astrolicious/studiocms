import Config from 'virtual:studiocms/config';

const fixSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '');

const {
	dashboardConfig: { dashboardRouteOverride },
} = Config;
const dashboardURL = dashboardRouteOverride ? fixSlashes(dashboardRouteOverride) : 'dashboard';

export const isDashboardRoute = (pageRoute: string): boolean => {
	return fixSlashes(pageRoute).includes(dashboardURL);
};

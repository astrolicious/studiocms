import { pluginList } from "studiocms:helpers";
import { externalNav } from "virtual:studiocms/_nav";
import Config from "virtual:studiocms/config";

type FrontEndRoute = {
    PageRoute: string;
    ProjectReference: string;
}

const { dashboardConfig: { dashboardRouteOverride } } = Config;
const dashboardURL = dashboardRouteOverride ? dashboardRouteOverride.replace(/^\/+|\/+$/g, '') : 'dashboard';
const studioCMSPluginList = pluginList;

export const getPageRouteReference = (pageRoute: string) => {
    const frontEndRoutes: FrontEndRoute[] = [
        { PageRoute: '/', ProjectReference: 'StudioCMS (Frontend)' },
        { PageRoute: '/[slug]', ProjectReference: 'StudioCMS (Frontend)' },
        { PageRoute: `/${dashboardURL}`, ProjectReference: 'StudioCMS (Dashboard)' }
    ]

    for (const entry of studioCMSPluginList) {
        const { name, label } = entry[1];
        for (const route of externalNav) {
            if (route[0].startsWith(name)) {
                if (!frontEndRoutes.some((routed) => routed.PageRoute === `/${route[1].slug}`)) {
                    frontEndRoutes.push({
                        PageRoute: `/${route[1].slug.replace(/^\/+|\/+$/g, '')}`,
                        ProjectReference: label
                    })
                    frontEndRoutes.push({
                        PageRoute: `/${route[1].slug.replace(/^\/+|\/+$/g, '')}/[slug]`,
                        ProjectReference: label
                    })
                }
            }
    }}

    const matchedRoute = frontEndRoutes.find(route => route.PageRoute === pageRoute );
    const matchedDashboardRoute = frontEndRoutes.find(route => route.PageRoute === (pageRoute.startsWith('/dashboard') ? '/dashboard' : false) );

    if (matchedRoute) {
        return matchedRoute.ProjectReference;
    }

    if (matchedDashboardRoute) {
        return matchedDashboardRoute.ProjectReference;
    }
    return 'Unknown source';
}
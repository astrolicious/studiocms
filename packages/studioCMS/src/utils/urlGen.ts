import { pathWithBase } from "studiocms:helpers";


export default async function urlGenFactory(
    isDashboardRoute: boolean,
    path: string|undefined,
    DashboardRouteOverride?: string
): Promise<string> {
    let url: string;
    let dashboardRoute = "dashboard";

    if (DashboardRouteOverride) {
        dashboardRoute = DashboardRouteOverride.replace(/^\//, '');
    }

    if (path) {
        if (isDashboardRoute) {
            url = pathWithBase(`${dashboardRoute}/${path}`)
        } else {
            url = pathWithBase(path);
        }
    } else {
        if (isDashboardRoute) {
            url = pathWithBase(dashboardRoute);
        } else {
            url = import.meta.env.BASE_URL;
        }
    }
    return url;
}


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
            url = `${import.meta.env.BASE_URL}${dashboardRoute}/${path}`;
        } else {
            url = `${import.meta.env.BASE_URL}${path}`;
        }
    } else {
        if (isDashboardRoute) {
            url = `${import.meta.env.BASE_URL}${dashboardRoute}`;
        } else {
            url = import.meta.env.BASE_URL;
        }
    }
    return url;
}
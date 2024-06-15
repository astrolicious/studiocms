import { defineUtility } from "astro-integration-kit";
import { studioLogger, type StudioLoggerOptsResolverResponse } from "../../../utils";

export const injectRouteArray = defineUtility("astro:config:setup")(
    (
            params, 
            opts: { 
                routes: {
                    pattern: string,
                    entrypoint: string,
                    _non_dashboard?: boolean
                }[],
                dashboardRouteOverride?: string|undefined,
             }
        ) => {

            const { injectRoute } = params;

            const { dashboardRouteOverride, routes } = opts;

            const defaultDashboardRoute = dashboardRouteOverride ? 
            dashboardRouteOverride.replace(/^\//, '') :
             "dashboard";

            const makeDashboardRoute = ( path: string ) => {
                return `${defaultDashboardRoute}/${path}`;
            }

            for (const route of routes) {
                const { _non_dashboard, pattern, entrypoint } = route;

                if (_non_dashboard) {
                    injectRoute({
                        pattern,
                        entrypoint
                    })
                } else {
                    injectRoute({
                        pattern: makeDashboardRoute(pattern),
                        entrypoint
                    })
                }

            }

    }
)

export const injectAuthRouteArray = defineUtility("astro:config:setup")(
    (
            params, 
            opts: { 
                providerRoutes: {
                    enabled: boolean,
                    logs: {
                        enabledMessage: string,
                        disabledMessage: string
                    },
                    routes: {
                        pattern: string,
                        entrypoint: string
                    }[],
                }[],
                dashboardRouteOverride?: string|undefined,
                LoggerOpts: StudioLoggerOptsResolverResponse,
             }
        ) => {

            const { injectRoute } = params;

            const { providerRoutes, dashboardRouteOverride, LoggerOpts: { logInfo } } = opts;

            const defaultDashboardRoute = dashboardRouteOverride ? 
            dashboardRouteOverride.replace(/^\//, '') :
             "dashboard";

            const makeDashboardRoute = ( path: string ) => {
                return `${defaultDashboardRoute}/${path}`;
            }

            for (const provider of providerRoutes) {
                const { enabled, logs, routes } = provider;

                if (enabled) {
                    const { enabledMessage } = logs;

                    studioLogger(logInfo, enabledMessage);

                    for (const route of routes) {
                        const { pattern, entrypoint } = route;

                        injectRoute({
                            pattern: makeDashboardRoute(pattern),
                            entrypoint
                        })
                    }
                } else {
                    const { disabledMessage } = logs;

                    studioLogger(logInfo, disabledMessage);
                }
            }
    }
)
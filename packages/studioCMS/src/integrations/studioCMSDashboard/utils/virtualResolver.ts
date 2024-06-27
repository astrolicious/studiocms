import { addDts, addVirtualImports, createResolver, defineUtility } from "astro-integration-kit";
import { fileFactory } from "../../../utils/fileFactory";

const { resolve } = createResolver(import.meta.url);

export const virtualResolver = defineUtility("astro:config:setup")(
    (
        params,
        opts: {
            name: string
        }
    ) => {

        const resolver = {
            lib: {
                Auth: resolve('../lib/auth.ts'),
            },
            utils: {
                AuthENVChecker: resolve('./authEnvCheck.ts'),
                RouteMap: resolve('./routemap.ts'),
            },
            components: {
                DashboardLayout: resolve('../routes/dashboard/layouts/Layout.astro'),
                FormattedDate: resolve('../../../components/exports/FormattedDate.astro'),
                WebVitalPanel: resolve('../routes/dashboard/components/WebVitalPanel.astro'),
            }
        }

        const authComponents = [
            resolver.lib.Auth,
            resolver.utils.AuthENVChecker,
        ]

        const astroComponents = [
            { name: 'Layout', path: resolver.components.DashboardLayout },
            { name: 'FormattedDate', path: resolver.components.FormattedDate },
            { name: 'WebVitalPanel', path: resolver.components.WebVitalPanel }
        ]

        const routeMap = [
            resolver.utils.RouteMap,
        ]

        let authComponentsMap = ""
        let astroComponentsMap = ""
        let routeMapMap = ""

        for (const comp of authComponents) {
            authComponentsMap += `export * from '${comp}'\n`
        }

        for (const comp of astroComponents) {
            astroComponentsMap += `export { default as ${comp.name} } from '${comp.path}'\n`
        }

        for (const comp of routeMap) {
            routeMapMap += `export * from '${comp}'\n`
        }

        const virtualImports: Record<string, string> = {
            'studiocms-dashboard:auth': authComponentsMap,
            'studiocms-dashboard:components': astroComponentsMap,
            'studiocms-dashboard:routeMap': routeMapMap,
        }

        const studioDashboardDTS = fileFactory();

        studioDashboardDTS.addLines(`declare module 'studiocms-dashboard:auth' {
            export const lucia: typeof import('${resolver.lib.Auth}').lucia;
            export const authEnvCheck: typeof import('${resolver.utils.AuthENVChecker}').authEnvCheck;
        }`);

        studioDashboardDTS.addLines(`declare module 'studiocms-dashboard:components' {
            export const Layout: typeof import('${resolver.components.DashboardLayout}').default;
            export const FormattedDate: typeof import('${resolver.components.FormattedDate}').default;
            export const WebVitalPanel: typeof import('${resolver.components.WebVitalPanel}').default;
        }`);

        studioDashboardDTS.addLines(`declare module 'studiocms-dashboard:routeMap' {
            export const getSluggedRoute: typeof import('${resolver.utils.RouteMap}').getSluggedRoute;
            export const getEditRoute: typeof import('${resolver.utils.RouteMap}').getEditRoute;
            export const getDeleteRoute: typeof import('${resolver.utils.RouteMap}').getDeleteRoute;
            export const StudioCMSRoutes: typeof import('${resolver.utils.RouteMap}').StudioCMSRoutes;
            export const sideBarLinkMap: typeof import('${resolver.utils.RouteMap}').sideBarLinkMap;
            export type SideBarLink = import('${resolver.utils.RouteMap}').SideBarLink;
        }`);
        
        addVirtualImports(params, {
            name: opts.name,
            imports: virtualImports,
        })

        addDts(params, {
            name: opts.name,
            content: studioDashboardDTS.text()
        })

    }
)
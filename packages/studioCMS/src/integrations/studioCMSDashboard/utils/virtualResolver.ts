import { addVirtualImports, createResolver, defineUtility } from 'astro-integration-kit';
import { fileFactory } from '../../../utils/fileFactory';

const { resolve } = createResolver(import.meta.url);

export const virtualResolver = defineUtility('astro:config:setup')(
	(
		params,
		opts: {
			name: string;
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
			},
			contentHelper: resolve('../../../utils/contentHelper.ts'),
		};

		const authComponents = [resolver.lib.Auth, resolver.utils.AuthENVChecker];

		const astroComponents = [
			{ name: 'Layout', path: resolver.components.DashboardLayout },
			{ name: 'FormattedDate', path: resolver.components.FormattedDate },
			{ name: 'WebVitalPanel', path: resolver.components.WebVitalPanel },
		];

		const routeMap = [resolver.utils.RouteMap];

		let authComponentsMap = '';
		let astroComponentsMap = '';
		let routeMapMap = '';

		for (const comp of authComponents) {
			authComponentsMap += `export * from '${comp}'\n`;
		}

		for (const comp of astroComponents) {
			astroComponentsMap += `export { default as ${comp.name} } from '${comp.path}'\n`;
		}

		for (const comp of routeMap) {
			routeMapMap += `export * from '${comp}'\n`;
		}

		const virtualImports: Record<string, string> = {
			'studiocms-dashboard:auth': authComponentsMap,
			'studiocms-dashboard:components': astroComponentsMap,
			'studiocms-dashboard:contentHelper': `export * from '${resolver.contentHelper}'`,
			'studiocms-dashboard:routeMap': routeMapMap,
		};

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

		studioDashboardDTS.addLines(`declare module 'studiocms-dashboard:contentHelper' {
            export type UserResponse = import('${resolver.contentHelper}').UserResponse;
            export type pageDataReponse = import('${resolver.contentHelper}').pageDataReponse;
            export type pageContentReponse = import('${resolver.contentHelper}').pageContentReponse;
            export type SiteConfigResponse = import('${resolver.contentHelper}').SiteConfigResponse;
            export type ContentHelperTempResponse = import('${resolver.contentHelper}').ContentHelperTempResponse;
            export const contentHelper: typeof import('${resolver.contentHelper}').contentHelper;
            export const getPageById: typeof import('${resolver.contentHelper}').getPageById;
            export const getPageList: typeof import('${resolver.contentHelper}').getPageList;
            export const getSiteConfig: typeof import('${resolver.contentHelper}').getSiteConfig;
            export const getUserById: typeof import('${resolver.contentHelper}').getUserById;
            export const getUserList: typeof import('${resolver.contentHelper}').getUserList;
            export const getPermissionsList: typeof import('${resolver.contentHelper}').getPermissionsList;
        }`);

		addVirtualImports(params, {
			name: opts.name,
			imports: virtualImports,
		});

		const resolvedDts = studioDashboardDTS.text();

		return { resolvedDts };
	}
);

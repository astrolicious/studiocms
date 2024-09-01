/**
 * # DEV TIP
 *
 * Wanting to extend StudioCMS? You can do so by defining a new module in the `virtual:studiocms` namespace within your project with the following format:
 *
 * This module can also be delcared from `@astrolicious/studiocms`.
 *
 * @example
 * declare module 'virtual:studiocms/config' {
 * const Config: import('@astrolicious/studiocms').StudioCMSOptions;
 * export default Config;
 * }
 */
declare module 'virtual:studiocms/config' {
	const Config: import('@studiocms/core').StudioCMSOptions;
	export default Config;
}

declare module 'virtual:studiocms/astromdremarkConfig' {
	const markdownConfig: import('astro').AstroConfig['markdown'];
	export default markdownConfig;
}

declare module 'virtual:studiocms/pluginSystem' {
	export const externalNav: typeof import('./src/index').externalNavigation;
	export const dashboardPageLinks: typeof import('./src/index').dashboardPageLinksMap;
	export const pluginList: typeof import('./src/index').studioCMSPluginList;
	export const customRenderers: string[];
}

declare module 'studiocms:components' {
	export const Avatar: typeof import('@studiocms/core/components').Avatar;
	export const FormattedDate: typeof import('@studiocms/core/components').FormattedDate;
	export const Genericheader: typeof import('@studiocms/core/components').GenericHeader;
	export const Navigation: typeof import('@studiocms/core/components').Navigation;
}

declare module 'studiocms:helpers' {
	export const authHelper: typeof import('@studiocms/core/helpers').authHelper;
	export const urlGenFactory: typeof import('@studiocms/core/helpers').urlGenFactory;
	export const toCamelCase: typeof import('@studiocms/core/helpers').toCamelCase;
	export const toPascalCase: typeof import('@studiocms/core/helpers').toPascalCase;
	export const pathWithBase: typeof import('@studiocms/core/helpers').pathWithBase;
	export const fileWithBase: typeof import('@studiocms/core/helpers').fileWithBase;
}

declare module 'studiocms:helpers/contentHelper' {
	export const contentHelper: typeof import('@studiocms/core/helpers').contentHelper;
	export const getSiteConfig: typeof import('@studiocms/core/helpers').getSiteConfig;
	export const getPageList: typeof import('@studiocms/core/helpers').getPageList;
	export const getUserList: typeof import('@studiocms/core/helpers').getUserList;
	export const getUserById: typeof import('@studiocms/core/helpers').getUserById;
	export type ContentHelperTempResponse =
		import('@studiocms/core/helpers').ContentHelperTempResponse;
	export type SiteConfigResponse = import('@studiocms/core/helpers').SiteConfigResponse;
	export type pageDataReponse = import('@studiocms/core/helpers').pageDataReponse;
	export type UserResponse = import('@studiocms/core/helpers').UserResponse;
}

declare module 'studiocms:helpers/headDefaults' {
	export const headDefaults: typeof import('@studiocms/core/helpers').headDefaults;
}

declare module 'studiocms:helpers/routemap' {
	export const getSluggedRoute: typeof import('@studiocms/core/helpers').getSluggedRoute;
	export const getEditRoute: typeof import('@studiocms/core/helpers').getEditRoute;
	export const getDeleteRoute: typeof import('@studiocms/core/helpers').getDeleteRoute;
	export const makeNonDashboardRoute: typeof import('@studiocms/core/helpers').makeNonDashboardRoute;
	export const makeDashboardRoute: typeof import('@studiocms/core/helpers').makeDashboardRoute;
	export const makeAPIDashboardRoute: typeof import('@studiocms/core/helpers').makeAPIDashboardRoute;
	export const StudioCMSRoutes: typeof import('@studiocms/core/helpers').StudioCMSRoutes;
	export const sideBarLinkMap: typeof import('@studiocms/core/helpers').sideBarLinkMap;
}


declare module 'studiocms:components' {
	export const CImage: typeof import('../studioCMS/src/components/exports/CImage.astro').default;
	export const FormattedDate: typeof import('../studioCMS/src/components/exports/FormattedDate.astro').default;
	export const StudioCMSRenderer: typeof import('../studioCMS/src/components/exports/StudioCMSRenderer.astro').default;
	export const contentHelper: typeof import('../studioCMS/src/utils/contentHelper').contentHelper;
	export type ContentHelperTempResponse = import('../studioCMS/src/utils/contentHelper').ContentHelperTempResponse;
	export type SiteConfigResponse = import('../studioCMS/src/utils/contentHelper').SiteConfigResponse;
	export const getSiteConfig: typeof import('../studioCMS/src/utils/contentHelper').getSiteConfig;
	export type pageDataReponse = import('../studioCMS/src/utils/contentHelper').pageDataReponse;
	export const getPageList: typeof import('../studioCMS/src/utils/contentHelper').getPageList;
	export type UserResponse = import('../studioCMS/src/utils/contentHelper').UserResponse;
	export const getUserById: typeof import('../studioCMS/src/utils/contentHelper').getUserById;
	export const getUserList: typeof import('../studioCMS/src/utils/contentHelper').getUserList;
	export const Navigation: typeof import('../studioCMS/src/components/exports/Navigation.astro').default;
	export const Avatar: typeof import('../studioCMS/src/components/exports/Avatar.astro').default;
	export const Layout: typeof import('../studioCMS/src/defaultRoutes/components/Layout.astro').default;
}
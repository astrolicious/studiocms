declare module 'virtual:studiocms/config' {
	const Config: import('./src/schemas').StudioCMSOptions;
	export default Config;
}

type usernameAndPasswordConfig = {
	salt: Input;
	opts: ScryptOpts;
}

declare module 'virtual:studiocms-dashboard/auth-sec' {
	const AuthSec: usernameAndPasswordConfig;
	export default AuthSec;
}

declare module 'studiocms:components' {
	export const CImage: typeof import('./src/components/exports/CImage.astro').default;
	export const FormattedDate: typeof import('./src/components/exports/FormattedDate.astro').default;
	export const StudioCMSRenderer: typeof import('./src/components/exports/StudioCMSRenderer.astro').default;
	export const contentHelper: typeof import('./src/utils/contentHelper').contentHelper;
	export type ContentHelperTempResponse = import('./src/utils/contentHelper').ContentHelperTempResponse;
	export type SiteConfigResponse = import('./src/utils/contentHelper').SiteConfigResponse;
	export const getSiteConfig: typeof import('./src/utils/contentHelper').getSiteConfig;
	export type pageDataReponse = import('./src/utils/contentHelper').pageDataReponse;
	export const getPageList: typeof import('./src/utils/contentHelper').getPageList; 
}

declare module 'studiocms:helpers' {
	export const authHelper: typeof import('./src/utils/authhelper').default;
	export const LocalsSchema: typeof import('./src/schemas/locals').LocalsSchema;
	export type Locals = import('./src/schemas/locals').Locals;
	export const PageDataAndContentSchema: typeof import('./src/schemas/dbtypehelpers').PageDataAndContentSchema;
	export type PageDataAndContent = import('./src/schemas/dbtypehelpers').PageDataAndContent;
	export const urlGenFactory: typeof import('./src/utils/urlGen').default;
	export const toCamelCase: typeof import('./src/utils/textFormatter').toCamelCase;
	export const toPascalCase: typeof import('./src/utils/textFormatter').toPascalCase;
}

declare module 'studiocms-dashboard:auth' {
	export const lucia: typeof import('./src/integrations/studioCMSDashboard/lib/auth').lucia;
	export const authEnvCheck: typeof import('./src/integrations/studioCMSDashboard/utils/authEnvCheck').authEnvCheck;
}

declare module 'studiocms-dashboard:components' {
	export const Layout: typeof import('./src/integrations/studioCMSDashboard/routes/dashboard/layouts/Layout.astro').default;
}

declare module 'studiocms-dashboard:routeMap' {
	export const getSluggedRoute: typeof import('./src/integrations/studioCMSDashboard/utils/routemap').getSluggedRoute;
	export const getEditRoute: typeof import('./src/integrations/studioCMSDashboard/utils/routemap').getEditRoute;
	export const getDeleteRoute: typeof import('./src/integrations/studioCMSDashboard/utils/routemap').getDeleteRoute;
	export const StudioCMSRoutes: typeof import('./src/integrations/studioCMSDashboard/utils/routemap').StudioCMSRoutes;
}

interface ImportMetaEnv {
	readonly CMS_GITHUB_CLIENT_ID: string;
	readonly CMS_GITHUB_CLIENT_SECRET: string;
	readonly CMS_DISCORD_CLIENT_ID: string;
	readonly CMS_DISCORD_CLIENT_SECRET: string;
	readonly CMS_DISCORD_REDIRECT_URI: string;
	readonly CMS_GOOGLE_CLIENT_ID: string;
	readonly CMS_GOOGLE_CLIENT_SECRET: string;
	readonly CMS_GOOGLE_REDIRECT_URI: string;
	readonly CMS_AUTH0_CLIENT_ID: string;
	readonly CMS_AUTH0_CLIENT_SECRET: string;
	readonly CMS_AUTH0_DOMAIN: string;
	readonly CMS_AUTH0_REDIRECT_URI: string;
	readonly CMS_CLOUDINARY_CLOUDNAME: string;
	readonly PROD: boolean;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	theme: {
	  setTheme: (theme: "auto" | "dark" | "light") => void;
	  getTheme: () => "auto" | "dark" | "light";
	  getSystemTheme: () => "light" | "dark";
	  getDefaultTheme: () => "auto" | "dark" | "light";
	};
}
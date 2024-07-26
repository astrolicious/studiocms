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
	const Config: import('./src/schemas').StudioCMSOptions;
	export default Config;
}

declare module 'virtual:studiocms/astromdremarkConfig' {
	const markdownConfig: import('astro').AstroConfig['markdown'];
	export default markdownConfig;
}

declare module 'virtual:studiocms/version' {
	const Version: string;
	export default Version;
}

/**
 * # DEV TIP
 *
 * Wanting to extend StudioCMS? You can do so by defining a new module in the `virtual:studiocms` namespace within your project with the following format:
 *
 * This module can also be delcared from `@astrolicious/studiocms`.
 *
 * @example
 * declare module 'virtual:studiocms-dashboard/AuthSecurityConfig' {
 * const AuthSecurityConfig: import('@astrolicious/studiocms').usernameAndPasswordConfig;
 * export default AuthSecurityConfig;
 * }
 */
declare module 'virtual:studiocms-dashboard/AuthSecurityConfig' {
	const AuthSecurityConfig: import('./src/integrations/studioCMSDashboard/schemas').usernameAndPasswordConfig;
	export default AuthSecurityConfig;
}

declare module 'virtual:studiocms/_nav' {
	export const externalNav: Map<string, { text: string; slug: string }>;
}

interface ImportMetaEnv {
	readonly PROD: boolean;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

interface Window {
	theme: {
		setTheme: (theme: 'auto' | 'dark' | 'light') => void;
		getTheme: () => 'auto' | 'dark' | 'light';
		getSystemTheme: () => 'light' | 'dark';
		getDefaultTheme: () => 'auto' | 'dark' | 'light';
	};
}

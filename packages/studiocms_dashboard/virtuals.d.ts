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

declare module 'virtual:studiocms/version' {
	const Version: string;
	export default Version;
}

declare module 'virtual:studiocms/pluginSystem' {
	export const externalNav: typeof import('./src/components/index').externalNavigation;
	export const dashboardPageLinks: typeof import('./src/components/index').dashboardPageLinksMap;
	export const pluginList: typeof import('./src/components/index').studioCMSPluginList;
	export const customRenderers: string[];
}

interface Window {
	theme: {
		setTheme: (theme: 'auto' | 'dark' | 'light') => void;
		getTheme: () => 'auto' | 'dark' | 'light';
		getSystemTheme: () => 'light' | 'dark';
		getDefaultTheme: () => 'auto' | 'dark' | 'light';
	};
}

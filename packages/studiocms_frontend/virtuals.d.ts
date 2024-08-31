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

declare module 'virtual:studiocms/version' {
	const Version: string;
	export default Version;
}
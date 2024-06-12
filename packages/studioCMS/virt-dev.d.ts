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

declare module 'virtual:studiocms-dashboard/auth-sec' {
	const AuthSec: import('./src/integrations/studioCMSDashboard/index.ts').usernameAndPasswordConfig;
	export default AuthSec;
}

declare module 'virtual:studiocms/_nav' {
	export const externalNav: Map<string, { text: string, slug: string }>;
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
	  setTheme: (theme: "auto" | "dark" | "light") => void;
	  getTheme: () => "auto" | "dark" | "light";
	  getSystemTheme: () => "light" | "dark";
	  getDefaultTheme: () => "auto" | "dark" | "light";
	};
}

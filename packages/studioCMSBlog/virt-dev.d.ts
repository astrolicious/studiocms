declare module 'virtual:studiocms/config' {
    const Config: import("@astrolicious/studiocms").StudioCMSOptions;
    export default Config;
}

interface ImportMetaEnv {
	readonly PROD: boolean;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
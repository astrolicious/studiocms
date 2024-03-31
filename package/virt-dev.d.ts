declare module 'virtual:astro-studio-cms:config' {
	const Config: import('./src/schemas').AstroStudioCMSOptions;
	export default Config;
}

declare module 'virtual:astro-studio-cms:internal' {
	export const currentAdapter: string;
}

interface ImportMetaEnv {
	readonly CMS_GITHUB_CLIENT_ID: string;
	readonly CMS_GITHUB_CLIENT_SECRET: string;
	readonly CMS_CLOUDINARY_CLOUDNAME: string;
	readonly PROD: boolean;
	readonly BASE_URL: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

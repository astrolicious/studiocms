declare module 'virtual:studiocms/config' {
	const Config: import('./src/schemas').StudioCMSOptions;
	export default Config;
}

declare module 'studiocms:components' {
	export const CImage: typeof import('./src/components/exports/CImage.astro').default;
	export const FormattedDate: typeof import('./src/components/exports/FormattedDate.astro').default;
	export const StudioCMSRenderer: typeof import('./src/components/exports/StudioCMSRenderer.astro').default;
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

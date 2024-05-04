declare module 'virtual:studiocms/config' {
	const Config: import('./src/schemas').StudioCMSOptions;
	export default Config;
}

declare module 'studiocms:components' {
	export const CImage: typeof import('./src/components/exports/CImage.astro').default;
	export const FormattedDate: typeof import('./src/components/exports/FormattedDate.astro').default;
	export const StudioCMSRenderer: typeof import('./src/components/exports/StudioCMSRenderer.astro').default;
}

declare module 'studiocms:helpers' {
	export const authHelper: typeof import('./src/utils/authhelper').default;
	export const LocalsSchema: typeof import('./src/schemas/locals').LocalsSchema;
	export type Locals = import('./src/schemas/locals').Locals;
}

declare module 'studiocms-dashboard:auth' {
	export const lucia: typeof import('./src/integrations/studioCMSDashboard/lib/auth').lucia;
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

// This file is generated by Astro DB
declare module 'astro:db' {
	export const SiteConfig: import("@astrojs/db/runtime").Table<
		"SiteConfig",
		{"id":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"id","collection":"SiteConfig","primaryKey":true}},"title":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"title","collection":"SiteConfig","primaryKey":false,"optional":false}},"description":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"description","collection":"SiteConfig","primaryKey":false,"optional":false}}}
	>;
	export const Blog: import("@astrojs/db/runtime").Table<
		"Blog",
		{"id":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"id","collection":"Blog","primaryKey":true}},"title":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"title","collection":"Blog","primaryKey":false,"optional":false}},"description":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"description","collection":"Blog","primaryKey":false,"optional":false}},"slug":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"slug","collection":"Blog","primaryKey":false,"optional":false}},"publishedAt":{"type":"date","schema":{"optional":false,"unique":false,"deprecated":false,"name":"publishedAt","collection":"Blog","default":{"__serializedSQL":true,"sql":"CURRENT_TIMESTAMP"}}},"updatedAt":{"type":"date","schema":{"optional":true,"unique":false,"deprecated":false,"name":"updatedAt","collection":"Blog"}},"heroImage":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"heroImage","collection":"Blog","default":"https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","primaryKey":false,"optional":false}},"content":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"content","collection":"Blog","multiline":true,"primaryKey":false,"optional":false}}}
	>;
	export const Pages: import("@astrojs/db/runtime").Table<
		"Pages",
		{"id":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"id","collection":"Pages","primaryKey":true}},"title":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"title","collection":"Pages","primaryKey":false,"optional":false}},"description":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"description","collection":"Pages","primaryKey":false,"optional":false}},"publishedAt":{"type":"date","schema":{"optional":false,"unique":false,"deprecated":false,"name":"publishedAt","collection":"Pages","default":{"__serializedSQL":true,"sql":"CURRENT_TIMESTAMP"}}},"slug":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"slug","collection":"Pages","primaryKey":false,"optional":false}},"heroImage":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"heroImage","collection":"Pages","default":"https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","primaryKey":false,"optional":false}},"content":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"content","collection":"Pages","multiline":true,"primaryKey":false,"optional":false}}}
	>;
	export const Session: import("@astrojs/db/runtime").Table<
		"Session",
		{"id":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"id","collection":"Session","primaryKey":true}},"userId":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"userId","collection":"Session","primaryKey":false,"optional":false,"references":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"id","collection":"User","primaryKey":true}}}},"expiresAt":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"expiresAt","collection":"Session","primaryKey":false,"optional":false}}}
	>;
	export const User: import("@astrojs/db/runtime").Table<
		"User",
		{"id":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"id","collection":"User","primaryKey":true}},"url":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"url","collection":"User","primaryKey":false,"optional":true}},"name":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"name","collection":"User","primaryKey":false,"optional":false}},"email":{"type":"text","schema":{"unique":true,"deprecated":false,"name":"email","collection":"User","primaryKey":false,"optional":true}},"avatar":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"avatar","collection":"User","primaryKey":false,"optional":true}},"githubId":{"type":"number","schema":{"unique":true,"deprecated":false,"name":"githubId","collection":"User","primaryKey":false,"optional":false}},"githubURL":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"githubURL","collection":"User","primaryKey":false,"optional":true}},"username":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"username","collection":"User","primaryKey":false,"optional":false}},"updatedAt":{"type":"date","schema":{"optional":false,"unique":false,"deprecated":false,"name":"updatedAt","collection":"User","default":{"__serializedSQL":true,"sql":"CURRENT_TIMESTAMP"}}},"createdAt":{"type":"date","schema":{"optional":false,"unique":false,"deprecated":false,"name":"createdAt","collection":"User","default":{"__serializedSQL":true,"sql":"CURRENT_TIMESTAMP"}}}}
	>;
	export const Permissions: import("@astrojs/db/runtime").Table<
		"Permissions",
		{"username":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"username","collection":"Permissions","primaryKey":false,"optional":false}},"rank":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"rank","collection":"Permissions","primaryKey":false,"optional":false}}}
	>;
}

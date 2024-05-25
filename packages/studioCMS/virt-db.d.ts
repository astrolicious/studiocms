// This file is generated by Astro DB
declare module 'astro:db' {
	export const SiteConfig: import("@astrojs/db/runtime").Table<
		"SiteConfig",
		{"id":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"id","collection":"SiteConfig","primaryKey":true}},"title":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"title","collection":"SiteConfig","primaryKey":false,"optional":false}},"description":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"description","collection":"SiteConfig","primaryKey":false,"optional":false}}}
	>;
	export const Session: import("@astrojs/db/runtime").Table<
		"Session",
		{"id":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"id","collection":"Session","primaryKey":true}},"userId":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"userId","collection":"Session","primaryKey":false,"optional":false,"references":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"id","collection":"User","default":"0d312650-23a2-4fd4-9edc-7941da499736","primaryKey":true}}}},"expiresAt":{"type":"number","schema":{"unique":false,"deprecated":false,"name":"expiresAt","collection":"Session","primaryKey":false,"optional":false}}}
	>;
	export const User: import("@astrojs/db/runtime").Table<
		"User",
		{"id":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"id","collection":"User","default":"0d312650-23a2-4fd4-9edc-7941da499736","primaryKey":true}},"url":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"url","collection":"User","primaryKey":false,"optional":true}},"name":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"name","collection":"User","primaryKey":false,"optional":false}},"email":{"type":"text","schema":{"unique":true,"deprecated":false,"name":"email","collection":"User","primaryKey":false,"optional":true}},"avatar":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"avatar","collection":"User","primaryKey":false,"optional":true}},"githubId":{"type":"number","schema":{"unique":true,"deprecated":false,"name":"githubId","collection":"User","primaryKey":false,"optional":true}},"githubURL":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"githubURL","collection":"User","primaryKey":false,"optional":true}},"discordId":{"type":"text","schema":{"unique":true,"deprecated":false,"name":"discordId","collection":"User","primaryKey":false,"optional":true}},"googleId":{"type":"text","schema":{"unique":true,"deprecated":false,"name":"googleId","collection":"User","primaryKey":false,"optional":true}},"auth0Id":{"type":"text","schema":{"unique":true,"deprecated":false,"name":"auth0Id","collection":"User","primaryKey":false,"optional":true}},"username":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"username","collection":"User","primaryKey":false,"optional":false}},"password":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"password","collection":"User","primaryKey":false,"optional":true}},"updatedAt":{"type":"date","schema":{"optional":false,"unique":false,"deprecated":false,"name":"updatedAt","collection":"User","default":{"__serializedSQL":true,"sql":"CURRENT_TIMESTAMP"}}},"createdAt":{"type":"date","schema":{"optional":false,"unique":false,"deprecated":false,"name":"createdAt","collection":"User","default":{"__serializedSQL":true,"sql":"CURRENT_TIMESTAMP"}}}}
	>;
	export const Permissions: import("@astrojs/db/runtime").Table<
		"Permissions",
		{"username":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"username","collection":"Permissions","primaryKey":false,"optional":false}},"rank":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"rank","collection":"Permissions","primaryKey":false,"optional":false}}}
	>;
	export const PageData: import("@astrojs/db/runtime").Table<
		"PageData",
		{"id":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"id","collection":"PageData","default":"bdb0b0c4-76bd-47a8-8e58-3bab65cd2c6f","primaryKey":true}},"package":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"package","collection":"PageData","default":"@astrolicious/studiocms","primaryKey":false,"optional":false}},"title":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"title","collection":"PageData","primaryKey":false,"optional":false}},"description":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"description","collection":"PageData","primaryKey":false,"optional":false}},"publishedAt":{"type":"date","schema":{"optional":false,"unique":false,"deprecated":false,"name":"publishedAt","collection":"PageData","default":{"__serializedSQL":true,"sql":"CURRENT_TIMESTAMP"}}},"updatedAt":{"type":"date","schema":{"optional":true,"unique":false,"deprecated":false,"name":"updatedAt","collection":"PageData"}},"slug":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"slug","collection":"PageData","primaryKey":false,"optional":false}},"contentLang":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"contentLang","collection":"PageData","default":"default","primaryKey":false,"optional":false}},"heroImage":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"heroImage","collection":"PageData","default":"https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D","primaryKey":false,"optional":false}}}
	>;
	export const PageContent: import("@astrojs/db/runtime").Table<
		"PageContent",
		{"id":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"id","collection":"PageContent","default":"65d489f5-6b2d-4195-a795-89f2f812cf30","primaryKey":true}},"contentId":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"contentId","collection":"PageContent","primaryKey":false,"optional":false,"references":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"id","collection":"PageData","default":"bdb0b0c4-76bd-47a8-8e58-3bab65cd2c6f","primaryKey":true}}}},"contentLang":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"contentLang","collection":"PageContent","default":"default","primaryKey":false,"optional":false}},"content":{"type":"text","schema":{"unique":false,"deprecated":false,"name":"content","collection":"PageContent","multiline":true,"primaryKey":false,"optional":true}}}
	>;
}

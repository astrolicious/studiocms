// @ts-expect-error - This is a missing type definition for the `astro:db` import since its a virtual module during Astro Runtime
import { defineDb } from 'astro:db';
import { Blog, PageContent, PageData, Permissions, Session, SiteConfig, User } from './tables';

// https://astro.build/db/config
export default defineDb({
	tables: {
		SiteConfig,
		Blog,
		Session,
		User,
		Permissions,
		PageData,
		PageContent,
	},
});

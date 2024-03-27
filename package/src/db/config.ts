// @ts-expect-error - This is a missing type definition for the `astro:db` import since its a virtual module during Astro Runtime
import { defineDb } from "astro:db";
import { Blog, Pages, Session, User, SiteConfig, Admins, Permissions } from './tables';

// https://astro.build/db/config
export default defineDb({
	tables: {
		SiteConfig,
		Blog, 
		Pages, 
		Admins,
		Session, 
		User, 
		Permissions,
	},
});
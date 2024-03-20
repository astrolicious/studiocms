
// @ts-expect-error
import { defineDb } from "astro:db";
import { Blog, Pages, Session, User, SiteConfig, Admins } from './tables';

// https://astro.build/db/config
export default defineDb({
	tables: {
		SiteConfig,
		Blog, 
		Pages, 
		Admins,
		Session, 
		User, 
	},
});
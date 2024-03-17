import { defineDb } from "astro:db";
import { Blog, Pages, Session, User } from './tables';

// https://astro.build/db/config
export default defineDb({
	tables: {
		Blog, Pages, Session, User,
	},
});
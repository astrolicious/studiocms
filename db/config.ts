import { defineDb } from 'astro:db';
import { Blog, Session, User, Admins } from './tables';

// https://astro.build/db/config
export default defineDb({
	tables: {
		Blog,
		Session,
		User,
		Admins,
	},
});

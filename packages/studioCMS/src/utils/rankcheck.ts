// @ts-expect-error - Types are only available during runtime
import { Permissions, db, eq } from 'astro:db';
import type { Locals } from '../pages/dashboard/locals';

export const rankCheck = async (locals: Locals) => {
	if (locals.isLoggedIn){
		const permissions = await db
			.select()
			.from(Permissions)
			.where(eq(Permissions.username, locals.user.username))
			.catch(() => {
				return false;
			});
		if (permissions[0] && permissions[0].username === locals.user.username) {
			if (permissions[0].rank === 'admin') {
				return 'admin';
			}
			if (permissions[0].rank === 'editor') {
				return 'editor';
			}
		}
	}
	return 'visitor';
};

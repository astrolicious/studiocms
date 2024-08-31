import { Permissions, db, sql } from 'astro:db';
import { lucia } from 'studiocms-dashboard:auth';
import type { Session } from 'lucia';
import type { Locals } from '../types/locals';

type authHelperResponse = {
	id: string;
	username: string | null;
	name: string | null;
	email: string | null;
	avatar: string | null;
	githubURL: string | null;
	permissionLevel: 'admin' | 'editor' | 'visitor' | 'unknown';
	currentUserSession: Session | undefined;
};

/**
 * # Auth Helper Function
 *
 * @param locals The Astro.locals object
 * @returns The current user data and session information and permission level
 */
export default async function authHelper(locals: Locals): Promise<authHelperResponse> {
	let user: authHelperResponse = {
		id: '',
		permissionLevel: 'unknown',
		username: null,
		name: null,
		email: null,
		avatar: null,
		githubURL: null,
		currentUserSession: undefined,
	};

	if (locals.isLoggedIn && locals.dbUser) {
		let permissionLevel: 'admin' | 'editor' | 'visitor' | 'unknown' = 'unknown';
		const permissions = await db
			.select()
			.from(Permissions)
			.where(sql`lower(${Permissions.username}) = ${locals.dbUser.username.toLowerCase()}`)
			.get();

		if (
			permissions &&
			permissions.username.toLowerCase() === locals.dbUser.username.toLowerCase()
		) {
			switch (permissions.rank) {
				case 'admin':
					permissionLevel = 'admin';
					break;
				case 'editor':
					permissionLevel = 'editor';
					break;
				case 'visitor':
					permissionLevel = 'visitor';
					break;
				default:
					permissionLevel = 'unknown';
					break;
			}
		}

		user = {
			id: locals.dbUser.id,
			username: locals.dbUser.username,
			name: locals.dbUser.name,
			email: locals.dbUser.email,
			avatar: locals.dbUser.avatar,
			githubURL: locals.dbUser.githubURL,
			currentUserSession: (await lucia.getUserSessions(locals.dbUser.id))[0],
			permissionLevel,
		};
	}

	return user;
}

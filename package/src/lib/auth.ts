// @ts-expect-error - This is a missing type definition for the `astro:db` import since its a virtual module during Astro Runtime
import { db } from 'astro:db';
import { asDrizzleTable } from '@astrojs/db/utils';
import { DrizzleSQLiteAdapter } from '@lucia-auth/adapter-drizzle';
import { Lucia, TimeSpan } from 'lucia';
import { Session, User } from '../db/tables';

const typeSafeSession = asDrizzleTable('Session', Session);
const typeSafeUser = asDrizzleTable('User', User);

const adapter = new DrizzleSQLiteAdapter(
	db,
	// @ts-expect-error - This is an error because of the way `astro:db` references other tables
	typeSafeSession,
	typeSafeUser
);
export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(2, 'w'),
	sessionCookie: {
		attributes: {
			secure: import.meta.env.PROD,
		},
	},
	getUserAttributes: (attributes) => {
		return {
			// attributes has the type of DatabaseUserAttributes
			githubId: attributes.githubId,
			username: attributes.username,
		};
	},
});

declare module 'lucia' {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	githubId: number;
	username: string;
}

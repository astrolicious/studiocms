import { User, db, sessionTable } from 'astro:db';
import { Lucia, TimeSpan } from 'lucia';
import { AstroDBAdapter } from './lucia-astrodb-adapter';

const adapter = new AstroDBAdapter(db, sessionTable, User);
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
			id: attributes.id,
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
	username: string;
	id: string;
}

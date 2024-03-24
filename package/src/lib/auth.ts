import { Lucia, TimeSpan } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub } from "arctic";
import { db } from "astro:db";
import { Session, User } from "../db/tables";
import { asDrizzleTable } from "@astrojs/db/utils";

export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET,
);

const typeSafeSession = asDrizzleTable("Session", Session);
const typeSafeUser = asDrizzleTable("User", User);

const adapter = new DrizzleSQLiteAdapter(
	db,
	typeSafeSession,
	typeSafeUser,
);
export const lucia = new Lucia(adapter, {
	sessionExpiresIn: new TimeSpan(2, "w"),
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

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

interface DatabaseUserAttributes {
	githubId: number;
	username: string;
}
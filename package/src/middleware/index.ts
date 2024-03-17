import { verifyRequestOrigin, Lucia, TimeSpan } from "lucia";
import { DrizzleSQLiteAdapter } from "@lucia-auth/adapter-drizzle";
import { GitHub } from "arctic";
import { defineMiddleware } from "astro/middleware";
import { asDrizzleTable, type SqliteDB } from "@astrojs/db/runtime";
import { Session, User } from "../db/tables";
import { db, eq } from "astro:db";

export const github = new GitHub(
	import.meta.env.GITHUB_CLIENT_ID,
	import.meta.env.GITHUB_CLIENT_SECRET,
);

const adapter = new DrizzleSQLiteAdapter(
	db as SqliteDB,
	asDrizzleTable("Session", Session),
	asDrizzleTable("User", User),
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

export const onRequest = defineMiddleware(async (context, next) => {
	if (context.request.method !== "GET") {
		const originHeader = context.request.headers.get("Origin");
		const hostHeader = context.request.headers.get("Host");
		if (
			!originHeader ||
			!hostHeader ||
			!verifyRequestOrigin(originHeader, [hostHeader])
		) {
			return new Response(null, {
				status: 403,
			});
		}
	}

	const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

	context.locals.isLoggedIn = false;
	if (!sessionId) {
		context.locals.user = null;
		context.locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (!session || session === null) {
		const sessionCookie = lucia.createBlankSessionCookie();
		context.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		return next();
	}

	// Upstream bug? `session.fresh` always seems to be `false`
	const isSessionFresh = session.expiresAt.getTime() > new Date().getTime();
	session.fresh = isSessionFresh;

	if (session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		context.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		const [dbUser] = await db
			.select()
			.from(asDrizzleTable("User", User))
			.where(eq(User.id, Number(user.id)));

		context.locals.dbUser = dbUser;
		context.locals.isLoggedIn = true;
	} else if (session && !session.fresh) {
		const sessionCookie = lucia.createBlankSessionCookie();
		await lucia.invalidateSession(session.id);
		context.cookies.set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
	}

	context.locals.session = session;
	context.locals.user = user;
	return next();
});
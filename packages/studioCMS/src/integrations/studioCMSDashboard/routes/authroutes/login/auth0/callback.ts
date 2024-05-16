// @ts-expect-error - Some types can only be imported from the Astro runtime
import { User, db, eq } from 'astro:db';
import { Auth0, OAuth2RequestError, type Auth0Tokens } from 'arctic';
import type { APIContext } from 'astro';
import { authEnvCheck, lucia } from "studiocms-dashboard:auth";
import Config from 'virtual:studiocms/config';
import { StudioCMSRoutes } from 'studiocms-dashboard:routeMap';
import { randomUUID } from 'node:crypto';

const { 
	dashboardConfig: { 
		AuthConfig: {
			providers
		},
	} 
  } = Config;

const { AUTH0: { CLIENT_ID, CLIENT_SECRET, DOMAIN, REDIRECT_URI } } = await authEnvCheck(providers);
const { authLinks: { loginURL }, mainLinks: { dashboardIndex } } = StudioCMSRoutes;

export async function GET(context: APIContext): Promise<Response> {
	const {
		url,
		cookies,
		redirect,
	} = context;
	

const cleanDomainslash = DOMAIN ?
						DOMAIN.replace(/^\//, '') : "";
const NoHTTPDOMAIN = cleanDomainslash
						.replace(/http:\/\//, '')
						.replace(/https:\/\//, '');
const clientDomain = `https://${NoHTTPDOMAIN}`;

	const auth0 = new Auth0(
		clientDomain, 
		CLIENT_ID?CLIENT_ID:"", 
		CLIENT_SECRET?CLIENT_SECRET:"", 
		REDIRECT_URI?REDIRECT_URI:""
	);

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('auth0_oauth_state')?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		// return new Response(null, {
		// 	status: 403,
		// });
		return redirect(loginURL);
	}

	try {
		const tokens: Auth0Tokens = await auth0.validateAuthorizationCode(code);
		const auth0Response = await fetch(`${clientDomain}/userinfo`, {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const auth0User: Auth0User = await auth0Response.json();
		const {
			sub: auth0Id,
			name,
			nickname: username,
			email,
			picture: avatar,
		} = auth0User;

		const existingUser = await db.select().from(User).where(eq(User.auth0Id, auth0Id)).get();

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return redirect(dashboardIndex);
		}

		const existingUserName = await db.select().from(User).where(eq(User.username, username)).get();
		const existingUserByEmail = await db.select().from(User).where(eq(User.email, email)).get();

		if (existingUserName || existingUserByEmail) {
			return new Response("User already exists", {
				status: 400,
			});
		}
		const createdUser = await db
			.insert(User)
			.values({
				id: randomUUID(),
				auth0Id,
				username,
				name: name ?? username,
				email,
				avatar,
			})
			.returning({ id: User.id })
			.get();

		const session = await lucia.createSession(createdUser.id, {});

		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return redirect(dashboardIndex);
	} catch (e) {
		// the specific error message depends on the provider
		if (e instanceof OAuth2RequestError) {
			// invalid code
			return new Response(null, {
				status: 400,
			});
		}
		console.error(e);
		return new Response(null, {
			status: 500,
		});
	}
}

interface Auth0User {
	sub: string;
	name: string;
	email: string;
	picture: string;
	nickname: string;
}
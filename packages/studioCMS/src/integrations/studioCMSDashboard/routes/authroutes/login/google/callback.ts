// @ts-expect-error - Some types can only be imported from the Astro runtime
import { User, db, eq } from 'astro:db';
import { Google, OAuth2RequestError } from 'arctic';
import type { APIContext } from 'astro';
import { authEnvCheck, lucia } from "studiocms-dashboard:auth";
import { urlGenFactory } from 'studiocms:helpers';
import Config from 'virtual:studiocms/config';

const { 
	dashboardConfig: { 
		AuthConfig: {
			providers
		},
	  dashboardRouteOverride,
	} 
  } = Config;

const { GOOGLE: { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } } = await authEnvCheck(providers);

export async function GET(context: APIContext): Promise<Response> {
	const {
		url,
		cookies,
		redirect,
	} = context;

	const google = new Google(
		CLIENT_ID?CLIENT_ID:"", 
		CLIENT_SECRET?CLIENT_SECRET:"", 
		REDIRECT_URI?REDIRECT_URI:"");
		
	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedCodeVerifier = cookies.get("google_oauth_code_verifier")?.value ?? null;
	const storedState = cookies.get('google_oauth_state')?.value ?? null;
	if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
		// return new Response(null, {
		// 	status: 403,
		// });
		return redirect(await urlGenFactory(true, "login", dashboardRouteOverride));
	}

	try {
		const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

		const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});
		const googleUser: GoogleUser = await response.json();
		const {
			sub: googleId,
			picture: avatar,
			name,
			email,
			name: username,
		} = googleUser;

		const existingUser = await db.select().from(User).where(eq(User.googleId, googleId)).get();

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id.toString(), {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return redirect(await urlGenFactory(true, undefined, dashboardRouteOverride));
		}

		const existingUserName = await db.select().from(User).where(eq(User.username, username)).get();

		if (existingUserName) {
			return new Response("User already exists", {
				status: 400,
			});
		}
		const createdUser = await db
			.insert(User)
			.values({
				googleId,
				username,
				name,
				email,
				avatar,
			})
			.returning()
			.get();

		const session = await lucia.createSession(createdUser.id.toString(), {});

		const sessionCookie = lucia.createSessionCookie(session.id);

		cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return redirect(await urlGenFactory(true, undefined, dashboardRouteOverride));
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

interface GoogleUser {
	sub: string;
	picture: string;
	name: string;
	email: string;
}

// @ts-expect-error - Some types can only be imported from the Astro runtime
import { User, db, eq } from 'astro:db';
import { GitHub, OAuth2RequestError } from 'arctic';
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

const { GITHUB: { CLIENT_ID, CLIENT_SECRET } } = await authEnvCheck(providers);

export async function GET(context: APIContext): Promise<Response> {
	const {
		url,
		cookies,
		redirect,
	} = context;

	const github = new GitHub(
		CLIENT_ID?CLIENT_ID:"",
		CLIENT_SECRET?CLIENT_SECRET:""
	);

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('github_oauth_state')?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		// return new Response(null, {
		// 	status: 403,
		// });
		return redirect(await urlGenFactory(true, "login", dashboardRouteOverride));
	}

	try {
		const tokens = await github.validateAuthorizationCode(code);
		const githubUserResponse = await fetch('https://api.github.com/user', {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`,
			},
		});

		const githubUser: GitHubUser = await githubUserResponse.json();
		const {
			id: githubId,
			html_url: githubURL,
			login: username,
			name,
			email,
			avatar_url: avatar,
		} = githubUser;

		const existingUser = await db.select().from(User).where(eq(User.githubId, githubId)).get();

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
				githubId,
				githubURL,
				username,
				name: name ?? username,
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

interface GitHubUser {
	id: number;
	html_url: string;
	login: string;
	avatar_url: string;
	name: string;
	blog: string;
	email: string;
}

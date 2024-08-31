import { randomUUID } from 'node:crypto';
import { StudioCMSUsers, db, eq } from 'astro:db';
import Config from 'virtual:studiocms/config';
import { StudioCMSRoutes } from '@studiocms/core';
import { GitHub, OAuth2RequestError } from 'arctic';
import type { APIContext } from 'astro';
import { lucia } from '../../../auth';
import { authEnvCheck } from '../../../utils/authEnvCheck';

const {
	dashboardConfig: {
		AuthConfig: { providers },
	},
} = Config;

const {
	GITHUB: { CLIENT_ID, CLIENT_SECRET },
} = await authEnvCheck(providers);
const {
	authLinks: { loginURL },
	mainLinks: { dashboardIndex },
} = StudioCMSRoutes;

export async function GET(context: APIContext): Promise<Response> {
	const { url, cookies, redirect } = context;

	const github = new GitHub(CLIENT_ID ? CLIENT_ID : '', CLIENT_SECRET ? CLIENT_SECRET : '');

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('github_oauth_state')?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		return redirect(loginURL);
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

		const existingUser = await db
			.select()
			.from(StudioCMSUsers)
			.where(eq(StudioCMSUsers.githubId, githubId))
			.get();

		if (existingUser) {
			const session = await lucia.createSession(existingUser.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return redirect(dashboardIndex);
		}

		const existingUserName = await db
			.select()
			.from(StudioCMSUsers)
			.where(eq(StudioCMSUsers.username, username))
			.get();
		const existingUserByEmail = await db
			.select()
			.from(StudioCMSUsers)
			.where(eq(StudioCMSUsers.email, email))
			.get();

		if (existingUserName || existingUserByEmail) {
			return new Response('User already exists', {
				status: 400,
			});
		}
		const createdUser = await db
			.insert(StudioCMSUsers)
			.values({
				id: randomUUID(),
				githubId,
				githubURL,
				username,
				name: name ?? username,
				email,
				avatar,
			})
			.returning({ id: StudioCMSUsers.id })
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

interface GitHubUser {
	id: number;
	html_url: string;
	login: string;
	avatar_url: string;
	name: string;
	blog: string;
	email: string;
}

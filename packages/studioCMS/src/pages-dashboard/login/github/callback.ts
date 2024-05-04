// @ts-expect-error - Some types can only be imported from the Astro runtime
import { User, db, eq } from 'astro:db';
import { GitHub, OAuth2RequestError } from 'arctic';
import type { APIContext } from 'astro';
// import { lucia } from '../../../lib/auth';
import { lucia } from "studiocms-dashboard:auth";

export async function GET(context: APIContext): Promise<Response> {
	const {
		locals: { runtime },
		url,
		cookies,
		redirect,
	} = context;

	const github = new GitHub(
		import.meta.env.CMS_GITHUB_CLIENT_ID || runtime.env.CMS_GITHUB_CLIENT_ID,
		import.meta.env.CMS_GITHUB_CLIENT_SECRET || runtime.env.CMS_GITHUB_CLIENT_ID
	);

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('github_oauth_state')?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		// return new Response(null, {
		// 	status: 403,
		// });
		return redirect('/dashboard/login');
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
			return redirect('/dashboard/');
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
		return redirect('/dashboard/');
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

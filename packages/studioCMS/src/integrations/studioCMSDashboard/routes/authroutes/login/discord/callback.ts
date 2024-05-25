// @ts-expect-error - Some types can only be imported from the Astro runtime
import { User, db, eq } from 'astro:db';
import { Discord, OAuth2RequestError, type DiscordTokens } from 'arctic';
import type { APIContext } from 'astro';
import { lucia } from "studiocms-dashboard:auth";
import Config from 'virtual:studiocms/config';
import { authEnvCheck } from 'studiocms-dashboard:auth';
import { StudioCMSRoutes } from 'studiocms-dashboard:routeMap';
import { randomUUID } from 'node:crypto';

const { 
	dashboardConfig: { 
		AuthConfig: {
			providers
		},
	} 
  } = Config;

const { DISCORD: { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI } } = await authEnvCheck(providers);
const { authLinks: { loginURL }, mainLinks: { dashboardIndex } } = StudioCMSRoutes;

export async function GET(context: APIContext): Promise<Response> {
	const {
		url,
		cookies,
		redirect,
	} = context;

	const discord = new Discord(
		CLIENT_ID?CLIENT_ID:"",
		CLIENT_SECRET?CLIENT_SECRET:"",
		REDIRECT_URI?REDIRECT_URI:""
	);

	const code = url.searchParams.get('code');
	const state = url.searchParams.get('state');
	const storedState = cookies.get('discord_oauth_state')?.value ?? null;
	if (!code || !state || !storedState || state !== storedState) {
		// return new Response(null, {
		// 	status: 403,
		// });
		return redirect(loginURL);
	}

	try {
		const tokens: DiscordTokens = await discord.validateAuthorizationCode(code);
		const discordResponse = await fetch("https://discord.com/api/users/@me", {
			headers: {
				Authorization: `Bearer ${tokens.accessToken}`
			}
		});

		const discordUser: DiscordUser = await discordResponse.json();

		const {
			id: discordId,
			avatar: avatarHash,
			username,
			global_name,
			email
		} = discordUser;

		const avatar = `https://cdn.discordapp.com/avatars/${discordId}/${avatarHash}.png`;

		const existingUserById = await db.select().from(User).where(eq(User.discordId, discordId)).get();

		if (existingUserById) {
			const session = await lucia.createSession(existingUserById.id, {});
			const sessionCookie = lucia.createSessionCookie(session.id);
			cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
			return redirect(dashboardIndex);
		}
		
		const existingUserByUsername = await db.select().from(User).where(eq(User.username, username)).get();
		const existingUserByEmail = await db.select().from(User).where(eq(User.email, email)).get();

		if (existingUserByUsername || existingUserByEmail) {
			return new Response("User already exists", {
				status: 400,
			});
		}
		const createdUser = await db
			.insert(User)
			.values({
				id: randomUUID(),
				discordId,
				username,
				name: global_name ?? username,
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

interface DiscordUser {
	id: string;
	avatar: string;
	username: string;
	global_name: string;
	email: string;
}

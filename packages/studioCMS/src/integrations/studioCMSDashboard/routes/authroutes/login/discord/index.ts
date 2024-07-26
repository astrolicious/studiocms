import { authEnvCheck } from 'studiocms-dashboard:auth';
import Config from 'virtual:studiocms/config';
import { generateState } from 'arctic';
import { Discord } from 'arctic';
import type { APIRoute } from 'astro';

const {
	DISCORD: { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI },
} = await authEnvCheck(Config.dashboardConfig.AuthConfig.providers);
export const GET: APIRoute = async ({ redirect, cookies }) => {
	const discord = new Discord(
		CLIENT_ID ? CLIENT_ID : '',
		CLIENT_SECRET ? CLIENT_SECRET : '',
		REDIRECT_URI ? REDIRECT_URI : ''
	);

	const state = generateState();
	const url: URL = await discord.createAuthorizationURL(state, { scopes: ['identify', 'email'] });

	cookies.set('discord_oauth_state', state, {
		path: import.meta.env.BASE_URL,
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
	});

	return redirect(url.toString());
};

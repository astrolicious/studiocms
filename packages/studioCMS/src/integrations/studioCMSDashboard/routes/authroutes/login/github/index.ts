import { authEnvCheck } from 'studiocms-dashboard:auth';
import Config from 'virtual:studiocms/config';
import { generateState } from 'arctic';
import { GitHub } from 'arctic';
import type { APIRoute } from 'astro';

const {
	GITHUB: { CLIENT_ID, CLIENT_SECRET },
} = await authEnvCheck(Config.dashboardConfig.AuthConfig.providers);

export const GET: APIRoute = async ({ redirect, cookies }) => {
	const github = new GitHub(CLIENT_ID ? CLIENT_ID : '', CLIENT_SECRET ? CLIENT_SECRET : '');
	const state = generateState();
	const url = await github.createAuthorizationURL(state);

	cookies.set('github_oauth_state', state, {
		path: import.meta.env.BASE_URL,
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	});

	return redirect(url.toString());
};

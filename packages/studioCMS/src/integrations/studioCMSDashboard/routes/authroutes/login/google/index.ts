import { authEnvCheck } from 'studiocms-dashboard:auth';
import Config from 'virtual:studiocms/config';
import { Google, generateCodeVerifier, generateState } from 'arctic';
import type { APIRoute } from 'astro';

const {
	GOOGLE: { CLIENT_ID, CLIENT_SECRET, REDIRECT_URI },
} = await authEnvCheck(Config.dashboardConfig.AuthConfig.providers);

export const GET: APIRoute = async ({ redirect, cookies }) => {
	const google = new Google(
		CLIENT_ID ? CLIENT_ID : '',
		CLIENT_SECRET ? CLIENT_SECRET : '',
		REDIRECT_URI ? REDIRECT_URI : ''
	);
	const state = generateState();
	const codeVerifier = generateCodeVerifier();
	const url = await google.createAuthorizationURL(state, codeVerifier, {
		scopes: ['profile', 'email'],
	});

	// store state verifier as cookie
	cookies.set('google_oauth_state', state, {
		secure: import.meta.env.PROD, // set to false in localhost
		path: import.meta.env.BASE_URL,
		httpOnly: true,
		maxAge: 60 * 10, // 10 min
	});

	// store code verifier as cookie
	cookies.set('google_oauth_code_verifier', codeVerifier, {
		secure: import.meta.env.PROD, // set to false in localhost
		path: import.meta.env.BASE_URL,
		httpOnly: true,
		maxAge: 60 * 10, // 10 min
	});

	return redirect(url.toString());
};

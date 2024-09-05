import Config from 'virtual:studiocms/config';
import { generateState } from 'arctic';
import { Auth0 } from 'arctic';
import type { APIRoute } from 'astro';
import { authEnvCheck } from '../../../utils/authEnvCheck';

const {
	AUTH0: { CLIENT_ID, CLIENT_SECRET, DOMAIN, REDIRECT_URI },
} = await authEnvCheck(Config.dashboardConfig.AuthConfig.providers);

const cleanDomainslash = DOMAIN ? DOMAIN.replace(/^\//, '') : '';
const NoHTTPDOMAIN = cleanDomainslash.replace(/http:\/\//, '').replace(/https:\/\//, '');
const clientDomain = `https://${NoHTTPDOMAIN}`;

export const GET: APIRoute = async ({ redirect, cookies }) => {
	const auth0 = new Auth0(
		clientDomain,
		CLIENT_ID ? CLIENT_ID : '',
		CLIENT_SECRET ? CLIENT_SECRET : '',
		REDIRECT_URI ? REDIRECT_URI : ''
	);
	const state = generateState();
	const url = await auth0.createAuthorizationURL(state, {
		scopes: ['profile', 'email'],
	});

	cookies.set('auth0_oauth_state', state, {
		path: import.meta.env.BASE_URL,
		secure: import.meta.env.PROD,
		httpOnly: true,
		maxAge: 60 * 10,
		sameSite: 'lax',
	});

	return redirect(url.toString());
};

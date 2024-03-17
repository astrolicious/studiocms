import type { APIRoute } from "astro";
import { generateState } from "arctic";
import { github } from "../../../../middleware";
import { getAstroBaseURL } from '../../../../utils';

export const GET: APIRoute = async ({ redirect, cookies }) => {
	const state = generateState();
	const url = await github.createAuthorizationURL(state);

    cookies.set('github_oauth_state', state, {
        path: getAstroBaseURL(),
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax'
    })
    
    return redirect(url.toString());
};
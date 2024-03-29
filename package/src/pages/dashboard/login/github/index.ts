import type { APIRoute } from "astro";
import { generateState } from "arctic";
import { GitHub } from "arctic";


export const GET: APIRoute = async ({ redirect, cookies, locals: { runtime } }) => {
    const github = new GitHub(
        import.meta.env.CMS_GITHUB_CLIENT_ID || runtime.env.CMS_GITHUB_CLIENT_ID,
        import.meta.env.CMS_GITHUB_CLIENT_SECRET || runtime.env.CMS_GITHUB_CLIENT_ID,
    );
	const state = generateState();
	const url = await github.createAuthorizationURL(state);

    cookies.set('github_oauth_state', state, {
        path: import.meta.env.BASE_URL,
        secure: import.meta.env.PROD,
        httpOnly: true,
        maxAge: 60 * 10,
        sameSite: 'lax'
    })
    
    return redirect(url.toString());
};
import { lucia } from 'studiocms-dashboard:auth';
import { StudioCMSRoutes } from 'studiocms-dashboard:routeMap';
import type { APIContext } from 'astro';

const {
	authLinks: { loginURL },
	mainLinks: { baseSiteURL },
} = StudioCMSRoutes;

export async function GET(context: APIContext): Promise<Response> {
	return context.redirect(baseSiteURL);
}

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.session) {
		return context.redirect(loginURL);
	}

	await lucia.invalidateSession(context.locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	context.locals.session = null;
	context.locals.isLoggedIn = false;
	context.locals.user = null;
	context.locals.dbUser = null;

	return context.redirect(baseSiteURL);
}

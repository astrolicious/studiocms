import { StudioCMSRoutes } from 'studiocms:helpers/routemap';
import type { APIContext } from 'astro';
import { lucia } from '../auth';

const {
	authLinks: { loginURL },
	mainLinks: { baseSiteURL },
} = StudioCMSRoutes;

export async function GET(context: APIContext): Promise<Response> {
	return context.redirect(baseSiteURL);
}

export async function POST(context: APIContext): Promise<Response> {
	// Map the Locals type from the schema
	const locals = context.locals;

	// If the user is not logged in, redirect to the login page
	if (!locals.session) {
		return context.redirect(loginURL);
	}

	// Invalidate the session and create a new session cookie
	await lucia.invalidateSession(locals.session.id);

	// Create a new session cookie
	const sessionCookie = lucia.createBlankSessionCookie();

	// Set the cookie in the context
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	// Set the locals to the default values
	locals.session = null;
	locals.isLoggedIn = false;
	locals.user = null;
	locals.dbUser = null;

	// Redirect to the base site URL
	return context.redirect(baseSiteURL);
}

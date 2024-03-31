import type { APIContext } from 'astro';
import { lucia } from '../../lib/auth';

export async function GET(context: APIContext): Promise<Response> {
	return context.redirect(import.meta.env.BASE_URL);
}

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.session) {
		return context.redirect('/dashboard/login');
	}

	await lucia.invalidateSession(context.locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	context.locals.session = null;
	context.locals.isLoggedIn = false;
	context.locals.user = null;
	context.locals.dbUser = null;

	return context.redirect('/');
}

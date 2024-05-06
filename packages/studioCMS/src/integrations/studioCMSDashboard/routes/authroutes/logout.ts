import type { APIContext } from 'astro';
import { lucia } from 'studiocms-dashboard:auth';
import { urlGenFactory } from 'studiocms:helpers';
import Config from 'virtual:studiocms/config';

const { 
	dashboardConfig: { 
	  dashboardRouteOverride,
	} 
  } = Config;
  
  const dashboardURL = dashboardRouteOverride || 'dashboard';

export async function GET(context: APIContext): Promise<Response> {
	return context.redirect(import.meta.env.BASE_URL);
}

export async function POST(context: APIContext): Promise<Response> {
	if (!context.locals.session) {
		return context.redirect(await urlGenFactory(true, "login", dashboardURL));
	}

	await lucia.invalidateSession(context.locals.session.id);

	const sessionCookie = lucia.createBlankSessionCookie();
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	context.locals.session = null;
	context.locals.isLoggedIn = false;
	context.locals.user = null;
	context.locals.dbUser = null;

	return context.redirect(import.meta.env.BASE_URL);
}

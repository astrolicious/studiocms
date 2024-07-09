import { User, db, eq } from 'astro:db';
import { defineMiddleware } from 'astro/middleware';
import { verifyRequestOrigin } from 'lucia';
import { lucia } from 'studiocms-dashboard:auth';
import type { Locals } from 'studiocms:helpers';
import Config from 'virtual:studiocms/config';
import { logger } from '@it-astro:logger:StudioCMS';

const {
	dashboardConfig: {
		developerConfig: { testingAndDemoMode },
		dashboardRouteOverride,
	},
} = Config;

const fixSlashes = (str: string) => str.replace(/^\/+|\/+$/g, '');

export const onRequest = defineMiddleware(async (context, next) => {
	if (context.request.method !== 'GET') {
		const originHeader = context.request.headers.get('Origin');
		const hostHeader = context.request.headers.get('Host');
		if (!originHeader || !hostHeader || !verifyRequestOrigin(originHeader, [hostHeader])) {
			return new Response(null, {
				status: 403,
			});
		}
	}

	const sessionId = context.cookies.get(lucia.sessionCookieName)?.value ?? null;

	const locals = context.locals as Locals;

	locals.isLoggedIn = false;
	if (!sessionId) {
		locals.user = null;
		locals.session = null;
		return next();
	}

	const { session, user } = await lucia.validateSession(sessionId);

	if (!session || session === null) {
		const sessionCookie = lucia.createBlankSessionCookie();
		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		return next();
	}

	const isSessionFresh = session.expiresAt.getTime() > new Date().getTime();
	session.fresh = isSessionFresh;

	if (session.fresh) {
		const sessionCookie = lucia.createSessionCookie(session.id);
		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
		const dbUser = await db.select().from(User).where(eq(User.id, user.id)).get();

		locals.dbUser = dbUser;
		locals.isLoggedIn = true;
	} else if (session && !session.fresh) {
		const sessionCookie = lucia.createBlankSessionCookie();
		await lucia.invalidateSession(session.id);
		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	locals.session = session;
	locals.user = user;

	const dashboardRoute = dashboardRouteOverride ? fixSlashes(dashboardRouteOverride) : 'dashboard';

	if (
		context.url.pathname.startsWith(`/${dashboardRoute}`) &&
		(!context.url.pathname.startsWith(`/${dashboardRoute}/login`) ||
			!context.url.pathname.startsWith(`/${dashboardRoute}/signup`))
	) {
		if (!testingAndDemoMode) {
			if (!locals.isLoggedIn) {
				logger.info('User is not logged in... Redirecting to login page');
				return new Response(null, {
					status: 302,
					headers: {
						Location: '/dashboard/login',
					},
				});
			}
		} else {
			logger.info('Testing and Demo mode is enabled. Skipping login check');
		}
	}

	return next();
});

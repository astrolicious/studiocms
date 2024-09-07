import { logger } from '@it-astro:logger:studiocms-auth';
import { db, eq } from 'astro:db';
import Config from 'virtual:studiocms/config';
import { tsUsers } from '@studiocms/core/db/tsTables';
import { removeLeadingTrailingSlashes } from '@studiocms/core/lib';
import type { MiddlewareHandler } from 'astro';
import { verifyRequestOrigin } from 'lucia';
import { lucia } from '../auth';
import { defineMiddlewareRouter } from './router';

const {
	dashboardConfig: {
		developerConfig: { testingAndDemoMode },
		dashboardRouteOverride,
	},
} = Config;

// Get the dashboard route
const dashboardRoute = dashboardRouteOverride
	? removeLeadingTrailingSlashes(dashboardRouteOverride)
	: 'dashboard';

// Define the middleware router
const router: Record<string, MiddlewareHandler> = {};

// Route for all paths
router['/**'] = async (context, next) => {
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

	const locals = context.locals;

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
		const dbUser = await db.select().from(tsUsers).where(eq(tsUsers.id, user.id)).get();

		locals.dbUser = dbUser || null;
		locals.isLoggedIn = true;
	} else if (session && !session.fresh) {
		const sessionCookie = lucia.createBlankSessionCookie();
		await lucia.invalidateSession(session.id);
		context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
	}

	locals.session = session;
	locals.user = user;

	return next();
};

// Route for all paths except login and signup
router[`/${dashboardRoute}/!(login|signup)**`] = async (context, next) => {
	const locals = context.locals;

	if (!testingAndDemoMode) {
		if (!locals.isLoggedIn) {
			logger.info('User is not logged in... Redirecting to login page');
			return new Response(null, {
				status: 302,
				headers: {
					Location: `/${dashboardRoute}/login`,
				},
			});
		}
	} else {
		logger.info('Testing and Demo mode is enabled. Skipping login check');
	}

	return next();
};

export const onRequest = defineMiddlewareRouter(router);

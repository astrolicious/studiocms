import { logger } from '@it-astro:logger:StudioCMS';
import { User, db, eq } from 'astro:db';
import { lucia } from 'studiocms-dashboard:auth';
import type { Locals } from 'studiocms:helpers';
import Config from 'virtual:studiocms/config';
import type { MiddlewareHandler } from 'astro';
import { verifyRequestOrigin } from 'lucia';
import { defineMiddlewareRouter } from './router';

const {
	dashboardConfig: {
		developerConfig: { testingAndDemoMode },
		dashboardRouteOverride,
	},
} = Config;

/**
 * This function is used to remove any trailing and leading slashes from a string
 *
 * @param {string} str - The string to remove slashes from
 *
 * @returns {string} - The string without any trailing or leading slashes
 *
 * @example
 * stripSlashes('/dashboard/') // 'dashboard'
 */
const stripSlashes = (str: string): string => str.replace(/^\/+|\/+$/g, '');

const dashboardRoute = dashboardRouteOverride ? stripSlashes(dashboardRouteOverride) : 'dashboard';

const router: Record<string, MiddlewareHandler> = {};
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

	return next();
};

router[`/${dashboardRoute}/!(login|signup)**`] = async (context, next) => {
	const locals = context.locals as Locals;

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

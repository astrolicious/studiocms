import { db, eq } from 'astro:db';
import AuthSecurityConfig from 'studiocms:auth/config';
import { scryptAsync } from '@noble/hashes/scrypt';
import { tsUsers } from '@studiocms/core/db/tsTables';
import { lucia } from '../../../auth';

const { salt: ScryptSalt, opts: ScryptOpts } = AuthSecurityConfig;

import type { APIContext } from 'astro';

export async function POST(context: APIContext): Promise<Response> {
	const formData = await context.request.formData();
	const username = formData.get('username');
	if (
		typeof username !== 'string' ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username)
	) {
		return new Response(JSON.stringify({ error: 'Invalid username' }), {
			status: 400,
		});
	}
	const password = formData.get('password');
	if (typeof password !== 'string' || password.length < 6 || password.length > 255) {
		return new Response(JSON.stringify({ error: 'Invalid password' }), {
			status: 400,
		});
	}

	const existingUser = await db.select().from(tsUsers).where(eq(tsUsers.username, username)).get();

	if (!existingUser) {
		return new Response(
			JSON.stringify({
				error: 'Incorrect username or password',
			}),
			{
				status: 400,
			}
		);
	}

	const serverToken = await scryptAsync(existingUser.id, ScryptSalt, ScryptOpts);
	const hashedPassword = await scryptAsync(password, serverToken, ScryptOpts);
	const hashedPasswordString = Buffer.from(hashedPassword.buffer).toString();
	const validPassword = hashedPasswordString === existingUser.password;

	if (!validPassword) {
		return new Response(
			JSON.stringify({
				error: 'Incorrect username or password',
			}),
			{
				status: 400,
			}
		);
	}

	const session = await lucia.createSession(existingUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return new Response();
}

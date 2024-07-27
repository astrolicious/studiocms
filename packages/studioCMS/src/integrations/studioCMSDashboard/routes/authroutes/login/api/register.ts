import { randomUUID } from 'node:crypto';
import { User, db, eq } from 'astro:db';
import { lucia } from 'studiocms-dashboard:auth';
import AuthSecurityConfig from 'virtual:studiocms-dashboard/AuthSecurityConfig';
import { scryptAsync } from '@noble/hashes/scrypt';
import type { APIContext } from 'astro';
import { z } from 'astro/zod';
import { reservedNames } from '@matthiesenxyz/integration-utils';

const { salt: ScryptSalt, opts: ScryptOpts } = AuthSecurityConfig;

export async function POST(context: APIContext): Promise<Response> {
	const formData = await context.request.formData();
	const username = formData.get('username');
	// username must be between 3 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
	// keep in mind some database (e.g. mysql) are case insensitive
	if (
		typeof username !== 'string' ||
		username.length < 3 ||
		username.length > 31 ||
		!/^[a-z0-9_-]+$/.test(username) ||
		reservedNames().check(username).username()
	) {
		return new Response(
			JSON.stringify({
				error: 'Invalid username',
			}),
			{
				status: 400,
			}
		);
	}
	const password = formData.get('password');
	if (
		typeof password !== 'string' ||
		password.length < 6 ||
		password.length > 255 ||
		reservedNames().check(password).password()
	) {
		return new Response(
			JSON.stringify({
				error: 'Invalid password',
			}),
			{
				status: 400,
			}
		);
	}

	const emailFormData = formData.get('email');
	const checkemail = z.coerce
		.string()
		.email({ message: 'Email address is invalid' })
		.safeParse(emailFormData);
	if (!checkemail.success) {
		return new Response(
			JSON.stringify({
				error: 'Invalid email',
			}),
			{
				status: 400,
			}
		);
	}

	const name = formData.get('displayname');

	const existingUsername = await db.select().from(User).where(eq(User.username, username)).get();
	const existingEmail = await db.select().from(User).where(eq(User.email, checkemail.data)).get();

	if (existingUsername || existingEmail) {
		return new Response(
			JSON.stringify({
				error: 'Username/Email already used',
			}),
			{
				status: 400,
			}
		);
	}

	// Make a gravatar Avatar from the email
	async function createGravatar(email: string) {
		// trim and lowercase the email
		const safeemail = email.trim().toLowerCase();
		// encode as (utf-8) Uint8Array
		const msgUint8 = new TextEncoder().encode(safeemail);
		// hash the message
		const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
		// convert buffer to byte array
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		// convert bytes to hex string
		const hashHex = hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
		// return the gravatar url
		return `https://www.gravatar.com/avatar/${hashHex}?s=400&d=mp`;
	}
	const avatar = await createGravatar(checkemail.data);

	const newUserId = await db
		.insert(User)
		.values({
			id: randomUUID(),
			name: name as string,
			email: checkemail.data,
			username,
			avatar,
		})
		.returning({ id: User.id })
		.get();

	const serverToken = await scryptAsync(newUserId.id, ScryptSalt, ScryptOpts);
	const newUser = await db.select().from(User).where(eq(User.username, username)).get();
	const hashedPassword = await scryptAsync(password, serverToken, ScryptOpts);
	const hashedPasswordString = Buffer.from(hashedPassword.buffer).toString();

	if (!newUser) {
		return new Response(
			JSON.stringify({
				error: 'User Error',
			}),
			{
				status: 400,
			}
		);
	}

	await db
		.update(User)
		.set({
			password: hashedPasswordString,
		})
		.where(eq(User.id, newUser.id));

	const session = await lucia.createSession(newUser.id, {});
	const sessionCookie = lucia.createSessionCookie(session.id);
	context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);

	return new Response();
}

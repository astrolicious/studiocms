// @ts-expect-error - Some types can only be imported from the Astro runtime
import { Blog, Permissions, Pages, SiteConfig, User, db, eq } from 'astro:db';
import { scryptAsync } from "@noble/hashes/scrypt";

import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
	const formData = await context.request.formData();

	const setupLocalAdmin = formData.get("local-setup")

	if (setupLocalAdmin === "1") {
		const username = formData.get("local-admin-name")?.toString();
		// username must be between 3 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
		// keep in mind some database (e.g. mysql) are case insensitive
		if (
			typeof username !== "string" ||
			username.length < 3 ||
			username.length > 31 ||
			!/^[a-z0-9_-]+$/.test(username)
		) {
			return new Response(
				JSON.stringify({
					error: "Invalid username"
				}),
				{
					status: 400
				}
			);
		}
		const password = formData.get("local-admin-password");
		if (typeof password !== "string" || password.length < 6 || password.length > 255) {
			return new Response(
				JSON.stringify({
					error: "Invalid password"
				}),
				{
					status: 400
				}
			);
		}
		const name = formData.get("local-admin-display-name");


		const existingUser = await db.select().from(User).where(eq(User.username, username)).get()

		if (existingUser) {
			return new Response(
				JSON.stringify({
					error: "User Error"
				}),
				{
					status: 400
				}
			);
		
		}
		await db
			.insert(User)
			.values({
				name: name as string,
				username,
			})

		const newUser = await db.select().from(User).where(eq(User.username, username)).get();
		const hashedPassword = await scryptAsync(password, newUser.id, { N: 2 ** 12, r: 8, p: 1, dkLen: 32 })
		const hashedPasswordString = Buffer.from(hashedPassword.buffer).toString();
		await db
			.update(User)
			.set({ 
				password: hashedPasswordString
			})
			.where(eq(User.id, newUser.id))

		await db
			.insert(Permissions)
			.values({
				username: username,
				rank: 'admin',
			})
		
	} else {
		const oAuthAdmin = formData.get("oauth-admin-name");

		await db
			.insert(Permissions)
			.values({
				username: oAuthAdmin as string,
				rank: 'admin',
			})
	}

	const title = formData.get('title');
	const description = formData.get('description');
	// const ogImage = formData.get('ogImage'); // TODO: Implement this

	const Config = await db.select().from(SiteConfig).where(eq(SiteConfig.id, 1)).get();

	if (Config) {
		return new Response(
			JSON.stringify({
				error: "Config Error: Already Exists"
			}),
			{
				status: 400
			}
		);
	}

	const dbBatchQueries = [];

	// Insert Site Config
	dbBatchQueries.push(
		await db
		.insert(SiteConfig)
		.values({
			title: title as string,
			description: description as string,
		})
	);

	const LOREM_IPSUM =
	'## Hello World \nLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';

	// Insert Default Pages
	dbBatchQueries.push(await db
		.insert(Pages)
		.values([
			{
				title: 'Home',
				slug: 'index',
				description: 'Index page',
				heroImage:
					'https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				content: LOREM_IPSUM,
			},
			{
				title: 'About',
				slug: 'about',
				description: 'About page',
				heroImage:
					'https://images.unsplash.com/photo-1661174585122-83a2909163ad?q=80&w=1169&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				content: LOREM_IPSUM,
			},
		])
	);

	// Insert Default Blog Post // TODO: Remove This
	dbBatchQueries.push(await db
		.insert(Blog)
		.values([
			{
				title: 'Hello, World!',
				slug: 'hello-world',
				description: 'Lorem ipsum dolor sit amet',
				publishedAt: new Date('2024-03-12T07:00:00Z'),
				heroImage:
					'https://images.unsplash.com/photo-1707343843982-f8275f3994c5?q=80&w=1032&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
				content: LOREM_IPSUM,
			},
		])
	);

	// Execute Batch Queries
	await db
		.batch(dbBatchQueries)
		.then(() => {
			return new Response('Successfully Seeded Database', { status: 200 });
		})
		.catch(() => {
			return new Response('Error Seeding Database', { status: 500 });
		});

    return new Response();
}
// @ts-expect-error - Some types can only be imported from the Astro runtime
import { User, db, eq } from 'astro:db';
import { lucia } from "studiocms-dashboard:auth";
import { Argon2id } from "oslo/password";

import type { APIContext } from "astro";

export async function POST(context: APIContext): Promise<Response> {
	const formData = await context.request.formData();
	const username = formData.get("username");
	// username must be between 4 ~ 31 characters, and only consists of lowercase letters, 0-9, -, and _
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
	const password = formData.get("password");
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

	const hashedPassword = await new Argon2id().hash(password);
	const name = formData.get("displayname");

    const existingUser = await db.select().from(User).where(eq(User.username, username)).get()

    if (existingUser) {
        return new Response(
            JSON.stringify({
                error: "Username/Email already used"
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
            password: hashedPassword,
        })

    const newUser = await db.select().from(User).where(eq(User.username, username)).get();
    const session = await lucia.createSession(newUser.id.toString(), {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    context.cookies.set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    
    return new Response();
}
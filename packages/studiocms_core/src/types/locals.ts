import { z } from 'astro/zod';

/**
 * Zod Schema for Astro.locals
 */
export const LocalsSchema = z.object({
	isLoggedIn: z.boolean(),
	dbUser: z
		.object({
			id: z.string(),
			url: z.string().nullable(),
			name: z.string(),
			email: z.string().nullable(),
			avatar: z.string().nullable(),
			githubId: z.number().nullable(),
			githubURL: z.string().nullable(),
			discordId: z.string().nullable(),
			googleId: z.string().nullable(),
			auth0Id: z.string().nullable(),
			username: z.string(),
			password: z.string().nullable(),
			updatedAt: z.date().nullable(),
			createdAt: z.date().nullable(),
		})
		.nullable()
		.optional(),
	user: z
		.object({
			id: z.string(),
			username: z.string().optional(),
			githubId: z.number().optional(),
		})
		.nullable(),
	session: z
		.object({
			id: z.string(),
			userId: z.string(),
			fresh: z.boolean(),
			expiresAt: z.date(),
		})
		.nullable(),
});

/**
 * Type for Astro.locals
 */
export type Locals = z.infer<typeof LocalsSchema>;

import { z } from 'astro/zod';

export const LocalsSchema = z.object({
    isLoggedIn: z.boolean(),
    dbUser: z.object({
        id: z.string(),
        url: z.string().nullable(),
        name: z.string(),
        email: z.string().nullable(),
        avatar: z.string().nullable(),
        githubId: z.number(),
        githubURL: z.string().nullable(),
        username: z.string(),
        updatedAt: z.date().nullable(),
        createdAt: z.date().nullable(),
    }),
    user: z.object({
        id: z.number(),
        username: z.string(),
        githubId: z.number(),
    }),
});

export type Locals = z.infer<typeof LocalsSchema>;
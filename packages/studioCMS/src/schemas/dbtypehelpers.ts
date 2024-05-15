import { z } from 'astro/zod';

export const PageDataAndContentSchema = z.object({
    PageData: z.object({
        id: z.string(),
        package: z.string(),
        title: z.string(),
        description: z.string(),
        publishedAt: z.date(),
        updatedAt: z.date().nullable(),
        slug: z.string(),
        contentLang: z.string().nullable(),
        heroImage: z.string(),
    }),
    PageContent: z.object({
        id: z.string(),
        contentId: z.string(),
        contentLang: z.string(),
        content: z.string().nullable(),
    }),
});

export type PageDataAndContent = z.infer<typeof PageDataAndContentSchema>;
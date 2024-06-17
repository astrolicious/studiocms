import { z } from "astro/zod";

/**
 * StudioCMS Blog Schema
 */
export const studioCMSBlogSchema = z.object({
    /**
     * Title to be used in the RSS Feed.
     */
    title: z.string().optional(),
    /**
     * Description to be used in the RSS Feed.
     */
    description: z.string().optional(),
    /**
     * Allows for the configuration of the Blog Index Page.
     */
    blogIndex: z.object({
        /**
         * Title to use for the Blog Index Page.
         */
        title: z.string().optional().default("Blog"),
        /**
         * Whether to show the RSS Feed URL on the Blog Index Page.
         */
        showRSSFeed: z.boolean().optional().default(true),
    }).optional(),
});

/**
 * StudioCMS Blog Schema Type
 */
export type StudioCMSBlogSchema = z.infer<typeof studioCMSBlogSchema>;
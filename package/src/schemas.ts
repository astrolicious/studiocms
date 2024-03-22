import { z } from "astro/zod";

export const optionsSchema = z.object({
    verbose: z.boolean().optional().default(false),
    dbStartPage: z.boolean().optional().default(true),
}).optional().default({});

export type Options = z.infer<typeof optionsSchema>;
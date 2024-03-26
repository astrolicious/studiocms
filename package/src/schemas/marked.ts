import { z } from "astro/zod";
import type { MarkedExtension } from "marked";

//
// MARKED EXTENSIONS SCHEMA
//
export const markedExtensionsSchema = z.object({
    /**
     * Allows the user to enable/disable the use of the `marked-alert` extension
     * @default true
     * @see https://www.npmjs.com/package/marked-alert
     */
    markedAlert: z.boolean().optional().default(true),
    /**
     * Allows the user to enable/disable the use of the `marked-footnote` extension
     * @default true
     * @see https://www.npmjs.com/package/marked-footnote
     */
    markedFootnote: z.boolean().optional().default(true),
    /**
     * Allows the user to enable/disable the use of the `marked-smartypants` extension
     * @default true
     * @see https://www.npmjs.com/package/marked-smartypants
     */
    markedSmartypants: z.boolean().optional().default(true),
    /**
     * Allows the user to enable/disable the use of the `marked-emoji` extension
     * @default true
     * @see https://www.npmjs.com/package/marked-emoji
     */
    markedEmoji: z.boolean().optional().default(true),
}).optional().default({})

//
// MARKED CONFIG SCHEMA
//
export const markedConfigSchema = z.object({
    /**
     * Allows Enabling and Disabling of the included Marked Extensions
     */
    includedExtensions: markedExtensionsSchema,
    /**
     * Allows the user to load additional Marked Extensions
     * 
     * Note: This option is only used if the user wants to load additional Marked Extensions
     */
    loadmarkedExtensions: z.array(z.custom<MarkedExtension>()).optional(),
}).optional().default({});

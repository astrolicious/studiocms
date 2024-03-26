import { z } from "astro/zod";
import { markedConfigSchema } from "./marked";
import { includedIntegrationsSchema } from "./integrations";
import { imageServiceSchema } from "./imageService";
import { authConfigSchema } from "./auth";

//
// MAIN SCHEMA
//
export const optionsSchema = z.object({
    /**
     * Project Initialization Page - Used during First Time Setup
     * @default true
     */
    dbStartPage: z.boolean().optional().default(true),
    /**
     * Allows customization of the Marked Configuration
     * 
     * Marked is a markdown parser and compiler. Built for speed. It is used to convert markdown strings into HTML for rendering content on StudioCMS pages.
     * @see https://marked.js.org/ for more info about marked.
     */
    markedConfig: markedConfigSchema,
    /**
     * Allows customization of the Image Service Options
     */
    imageService: imageServiceSchema,
    /**
     * Allows customization of the Authentication Configuration
     */
    authConfig: authConfigSchema,
    /**
     * Allows enabling and disabling of the included integrations
     */
    includedIntegrations: includedIntegrationsSchema,
    /**
     * Whether to show verbose output
     * @default false
     */
    verbose: z.boolean().optional().default(false),
}).optional().default({});

export type AstroStudioCMSOptions = z.infer<typeof optionsSchema>;
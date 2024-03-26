import { z } from "astro/zod";

//
// INTEGRATIONS CONFIG SCHEMA
//
export const includedIntegrationsSchema = z.object({
    /**
     * Allows the user to enable/disable the use of the Astro Robots Plugin
     * For more information on the Astro Robots Plugin, visit:
     * @see https://www.npmjs.com/package/astro-robots
     * @default true
     */
    astroRobots: z.boolean().optional().default(true),
    /**
     * Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin
     * For more information on the Inox-tools Sitemap Plugin, visit:
     * @see https://inox-tools.vercel.app/sitemap-ext
     * @default true
     */
    inoxSitemap: z.boolean().optional().default(true),
}).optional().default({});

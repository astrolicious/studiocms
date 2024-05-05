import { z } from "astro/zod";
import { authConfigSchema } from "./auth";
import { developerConfigSchema } from "./developer";

export const dashboardConfigSchema = z.object({
    /**
     * OPTIONAL - This allows the user to enable or disable the Astro Studio CMS Dashboard but still provide all the helper's and utilities to those who are customizing their setup, doing so will disable the dashboard and you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build
     * 
     * @default true
     */
    dashboardEnabled: z.boolean().optional().default(true),
    /**
     * OPTIONAL - This allows the user to override the default dashboard route 
     * 
     * **Note: THIS IS NOT CURRENTLY IMPLEMENTED**
     * 
     * @default "dashboard"
     */
    dashboardRouteOverride: z.string().optional(),
    /**
     * Auth Configuration - Allows customization of the Authentication Configuration
     */
    AuthConfig: authConfigSchema,
    /**
     * Developer Options/Configuration
     */
    developerConfig: developerConfigSchema,
}).optional().default({});
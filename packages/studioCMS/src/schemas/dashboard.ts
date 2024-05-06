import { z } from "astro/zod";
import { authConfigSchema } from "./auth";
import { developerConfigSchema } from "./developer";
import { unocssConfigSchema } from "./unocss";

export const dashboardConfigSchema = z.object({
    /**
     * OPTIONAL - This allows the user to enable or disable the Astro Studio CMS Dashboard but still provide all the helper's and utilities to those who are customizing their setup, doing so will disable the dashboard and you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build
     * 
     * @default true
     */
    dashboardEnabled: z.boolean().optional().default(true),
    /**
     * OPTIONAL - This allows the user to override the default Favicon URL to a custom URL
     */
    faviconURL: z.string().optional().default("/favicon.svg"),
    /**
     * OPTIONAL - This allows the user to override the default dashboard route to a custom route
     * 
     * **Note: Use with caution, this is an advanced feature**
     * 
     * @usage - The default route is `dashboard` without any `/` or `\` characters. If you want to override the route to `/admin` you would set this value to `admin`
     * 
     * @default "dashboard"
     */
    dashboardRouteOverride: z.string().optional(),
    /**
     * Auth Configuration - Allows customization of the Authentication Configuration
     */
    AuthConfig: authConfigSchema,
    /**
     * UnoCSS Configuration - Allows customization of the UnoCSS Configuration
     * 
     * **Note: Use with caution, this is an advanced feature**
     * 
     * StudioCMS uses UnoCSS+DaisyUI to provide a TailwindCSS-like experience with minimal CSS+prebuilt theme options!. This configuration allows you to override the default configuration.
     */
    UnoCSSConfigOverride: unocssConfigSchema,
    /**
     * Developer Options/Configuration
     */
    developerConfig: developerConfigSchema,
}).optional().default({});
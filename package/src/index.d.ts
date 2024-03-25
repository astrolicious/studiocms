import type { AstroIntegration } from "astro";
import type { AstroStudioCMSOptions } from "./schemas";

/**
 * # Astro Studio CMS Integration 
 * A CMS built for Astro by the Astro Community
 * 
 * Check out [Astro-StudioCMS.xyz](https://astro-studiocms.xyz) or the Built-in JSDocs *(Hover Docs like this)* for more information.
 * 
 * > **Note: Astro SSR adapters that are configured for Image Optimization will automatically take full control of the Image Optimization Service. Making the `imageService` option in this integration not have any effect.**
 * 
 * Example Configuration using Generic Node Adapter:
 * ```ts
 * import { defineConfig } from "astro/config";
 * import node from "@astrojs/node";
 * import db from "@astrojs/db";
 * import astroStudioCMS from "@nametdb/astro-studiocms";
 * 
 * export default defineConfig({
 *   site: 'https://example.com',
 *   output: "server",
 *   adapter: node({ mode: 'standalone', }),
 *   integrations: [
 *     db(), 
 *     astroStudioCMS({
 *       dbStartPage: true, // Show the First Time Setup Page
 *       authConfig: {
 *         mode: "built-in", // Use the Built-in Authentication (Default)
 *       },
 *       imageService: {
 *         useUnpic: true, // Use the `@unpic/astro` Image Service (Default)
 *         astroImageServiceConfig: "squoosh", // Choose Between the 3 different Astro Image Services (Default: "squoosh")
 *         unpicConfig: {
 *           // Pass-through options for Unpic Configuration
 *           fallbackService: "squoosh" //falls back to `"astroImageServiceConfig"` if not set here
 *           // fallback Service can be set to any available CDN service, unpic supports alot of CDN's see: https://unpic.pics/lib/#supported-cdn-apis
 *           layout: "constrained", // Default: "constrained"
 *           placeholder: "blurhash", // Default: "blurhash"
 *           cdnOptions: {
 *            // Pass-through options for Unpic CDN Configuration
 *            // See: https://unpic.pics/lib/
 *           }
 *         },
 *       },
 *      verbose: false, // Show Verbose Output (Default: false)
 *     }),
 *   ],
 * });
 * ```
 */
export default function astroStudioCMS(options?: AstroStudioCMSOptions): AstroIntegration;
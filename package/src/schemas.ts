import { z } from "astro/zod";
import type { MarkedExtension } from "marked";
import type { ImageCdn, CdnOptions } from "unpic";

//
// Custom Types used for `z.custom`
//
type UnpicFallbackServiceOptions = ImageCdn | "sharp" | "squoosh";
type UnpicPlaceHolder = "blurhash" | "dominantColor" | "lqip" | (string & {});
type UnpicLayout = "constrained" | "fixed" | "fullWidth";
type AstroImageService = "sharp" | "squoosh" | "no-op";
type authConfigModeOptions = "plugin" | "built-in" | "disable";
type cdnImageServicePlugin = "cloudinary-js";

//
// UNPIC CONFIG OPTIONS SCHEMA
//
export const unpicConfigSchema = z.object({
    /**
     * The image service to use for local images and when the CDN can't be
     * determined from the image src. Value can be any supported image CDN,
     * or "sharp" or "squoosh" to use the local image service.
     * By default it will either use the local "squoosh" service, or will
     * try to detect available services based on the environment.
     * This detection currently works on Netlify and Vercel.
     * 
     * Falls back to the value of `astroImageServiceConfig` if not set here
     */
    fallbackService: z.custom<UnpicFallbackServiceOptions>().optional(),
    /**
     * The default placeholder background to use for images.
     * Can be `"blurhash"`, `"dominantColor"`, `"lqip"`, a data URI or a CSS color string.
     * Local images don't support `"blurhash"`, `"dominantColor"` or `"lqip"`, and will
     * not include a background unless a data URI or CSS color string is provided.
     * Default is no background.
     * Note that because the element uses no Javascript, the background will not
     * be removed when the image loads, so you should not use it for images that
     * have transparency.
     *
     * @see https://unpic.pics/placeholder
     * @default "blurhash"
     */
    placeholder: z.custom<UnpicPlaceHolder>().optional().default("blurhash"),
    /**
     * The default layout to use for images. Defaults to "constrained".
     * @see https://unpic.pics/img/learn/#layouts
     * @default "constrained"
     */
    layout: z.custom<UnpicLayout>().optional().default("constrained"),
    /**
     * CDN-specific options.
     */
    cdnOptions: z.custom<CdnOptions>().optional().default({}),
}).optional().default({})

//
// IMAGE SERVICE SCHEMA
//
export const imageServiceSchema = z.object({
    /**
     * OPTIONAL - Allows the user to enable/disable the use of the `@unpic/astro` image optimization service for external images
     * @default true
     */
    useUnpic: z.boolean().optional().default(true),
    /**
     * OPTIONAL - Allows the user to customize the `@unpic/astro` image optimization service
     */
    unpicConfig: unpicConfigSchema,
    /**
     * If the user wants to disable the `@unpic/astro` image service, they can specify their desired Astro Built-in Image Service using this option.
     * 
     * Note: This option is only used if `useUnpic` is set to `false`
     * @default "squoosh"
     */
    astroImageServiceConfig: z.custom<AstroImageService>().optional().default("squoosh"),
    /**
     * If the user wants to use a custom Supported CDN Plugin, they can specify it here.
     * 
     * Currently Supported CDN Plugins: **cloudinary-js**
     * 
     * Note: Enabling this option will disable the use of the `@unpic/astro` image service for external images. For local images and Fallback, the `astroImageServiceConfig` will be used.
     */
    cdnPlugin: z.custom<cdnImageServicePlugin>().optional(),
}).optional().default({})

//
// AUTH CONFIG SCHEMA
//
export const authConfigSchema = z.object({
    /**
     * OPTIONAL - Allows the user to customize the authentication mode for the Astro Studio CMS
     * 
     * Disable - Disables authentication & the ENTIRE dashboard for the Astro Studio CMS This means you will need to manage your content via the Astro Studio Dashboard at http://studio.astro.build
     * 
     * @default "built-in"
     * @param `"plugin"` - Enables authentication via a plugin
     * @param `"built-in"` - Enables authentication via the built-in Astro Studio CMS authentication (Lucia Auth)
     * @param `"disable"` - Disables authentication & the Internal dashboard and the user will need to manage their content via the Astro Studio Dashboard at http://studio.astro.build
     */
    mode: z.custom<authConfigModeOptions>().optional().default("built-in"),
    /**
     * Not yet implemented
     */
    plugins: z.boolean().optional().default(false),
}).optional().default({});

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

//
// MARKED CONFIG SCHEMA
//
export const markedConfigSchema = z.object({
    /**
     * Allows Enabling and Disabling of the included Marked Extensions
     */
    includedExtensions: z.object({
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
    }).optional().default({}),
    /**
     * Allows the user to load additional Marked Extensions
     * 
     * Note: This option is only used if the user wants to load additional Marked Extensions
     */
    loadmarkedExtensions: z.array(z.custom<MarkedExtension>()).optional()
}).optional().default({});

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
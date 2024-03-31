import { z } from 'astro/zod';

//
// Custom Types used for `z.custom`
//
type authConfigModeOptions = 'plugin' | 'built-in' | 'disable';

//
// AUTH CONFIG SCHEMA
//
export const authConfigSchema = z
	.object({
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
		mode: z.custom<authConfigModeOptions>().optional().default('built-in'),
		/**
		 * Not yet implemented
		 */
		plugins: z.boolean().optional().default(false),
	})
	.optional()
	.default({});

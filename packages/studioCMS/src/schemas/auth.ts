import { z } from 'astro/zod';

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
		 * @default "true"
		 * @param `"true"` - Enables authentication via the built-in Astro Studio CMS authentication (Lucia Auth)
		 * @param `"false"` - Disables authentication & the Internal dashboard and the user will need to manage their content via the Astro Studio Dashboard at http://studio.astro.build
		 */
		mode: z.boolean().optional().default(true),
	})
	.optional()
	.default({});

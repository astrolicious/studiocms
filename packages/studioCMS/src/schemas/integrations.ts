import type { RobotsConfig } from '../integrations/robotstxt';
import { z } from 'astro/zod';

//
// INTEGRATIONS CONFIG SCHEMA
//
export const includedIntegrationsSchema = z
	.object({
		/**
		 * Allows the user to enable/disable the use of the StudioCMS Custom `astro-robots-txt` Integration
		 * 
		 * @default true
		 */
		useAstroRobots: z.boolean().optional().default(true),
		astroRobotsConfig: z.custom<RobotsConfig>().default({}),
		/**
		 * Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin
		 * For more information on the Inox-tools Sitemap Plugin, visit:
		 * @see https://inox-tools.vercel.app/sitemap-ext
		 * 
		 * # TEMPORARILY DISABLED
		 * If you would like to still use the Inox-tools Sitemap Plugin, you can manually add it to your project's Integrations.
		 */
		useInoxSitemap: z.boolean().optional().default(true),
	})
	.optional()
	.default({});

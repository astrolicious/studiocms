import type { RobotsConfig } from '../integrations/robotstxt';
import { z } from 'astro/zod';

//
// INTEGRATIONS CONFIG SCHEMA
//
export const includedIntegrationsSchema = z
	.object({
		/**
		 * Allows the user to enable/disable the use of the Astro Robots Plugin
		 * 
		 * @default true
		 */
		useAstroRobots: z.boolean().optional().default(true),
		astroRobotsConfig: z.custom<RobotsConfig>().default({}),
		// /**
		//  * Allows the user to enable/disable the use of the Inox-tools Sitemap Plugin
		//  * For more information on the Inox-tools Sitemap Plugin, visit:
		//  * @see https://inox-tools.vercel.app/sitemap-ext
		//  * @default true
		//  */
		useInoxSitemap: z.boolean().optional().default(true),
	})
	.optional()
	.default({});

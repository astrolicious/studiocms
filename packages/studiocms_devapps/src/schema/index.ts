import { z } from 'astro/zod';
import { AppsConfigSchema } from './appsConfig';

export const optionsSchema = z
	.object({
		appsConfig: AppsConfigSchema,
		verbose: z.boolean().optional().default(false),
	})
	.optional()
	.default({});

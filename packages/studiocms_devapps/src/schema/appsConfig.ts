import { z } from 'astro/zod';

export const AppsConfigSchema = z
	.object({
		libSQLViewer: z
			.object({
				enabled: z.boolean().optional().default(true),
			})
			.optional()
			.default({}),
	})
	.optional()
	.default({});

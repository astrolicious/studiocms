import { z } from 'astro/zod';

export const AppsConfigSchema = z
	.object({
		/**
		 * libSQLViewer App Config
		 */
		libSQLViewer: z
			.object({
				/**
				 * Enable libSQLViewer app
				 * @default true
				 */
				enabled: z.boolean().optional().default(true),
				/**
				 * Endpoint path for libSQLViewer
				 * @default '/libsql-viewer'
				 */
				endpoint: z.string().optional().default('/libsql-viewer'),
			})
			.optional()
			.default({}),
	})
	.optional()
	.default({});

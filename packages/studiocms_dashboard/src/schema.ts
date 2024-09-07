import { dashboardConfigSchema } from '@studiocms/core/schemas';
import { z } from 'astro/zod';

/**
 * StudioCMS Dashboard Integration Options Schema
 */
export const StudioCMSDashboardOptionsSchema = z.object({
	verbose: z.boolean().optional().default(false),
	dbStartPage: z.boolean().optional().default(true),
	dashboardConfig: dashboardConfigSchema,
});

/**
 * StudioCMS Dashboard Integration Options Type
 */
export type StudioCMSDashboardOptions = z.infer<typeof StudioCMSDashboardOptionsSchema>;

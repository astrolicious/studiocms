import { DefaultFrontEndConfigSchema } from '@studiocms/core/schemas';
import { z } from 'astro/zod';

/**
 * StudioCMS Frontend Integration Options Schema
 */
export const StudioCMSFrontEndOptionsSchema = z.object({
	verbose: z.boolean().optional().default(false),
	dbStartPage: z.boolean().optional().default(true),
	defaultFrontEndConfig: DefaultFrontEndConfigSchema,
});

/**
 * StudioCMS Frontend Integration Options Type
 */
export type StudioCMSFrontEndOptions = z.infer<typeof StudioCMSFrontEndOptionsSchema>;

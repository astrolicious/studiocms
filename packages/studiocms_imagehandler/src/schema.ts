import { imageServiceSchema, overridesSchema } from '@studiocms/core/schemas';
import { z } from 'astro/zod';

/**
 * StudioCMS imageHandler Integration Options Schema
 */
export const StudioCMSImageHandlerOptionsSchema = z
	.object({
		verbose: z.boolean().optional().default(false),
		imageService: imageServiceSchema,
		overrides: overridesSchema,
	})
	.optional()
	.default({});

/**
 * StudioCMS imageHandler Integration Options Type
 */
export type StudioCMSImageHandlerOptions = z.infer<typeof StudioCMSImageHandlerOptionsSchema>;
